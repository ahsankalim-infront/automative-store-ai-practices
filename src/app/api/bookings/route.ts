import { getBookings, createBooking } from "@/lib/data/repositories";
import { ok, fail, requireAuth } from "@/lib/api/helpers";
import type { ServiceBooking } from "@/types";
import { logActivityFromRequest, actorFromJwt } from "@/lib/activity-log";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;
  return ok(await getBookings(auth.sub));
}

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const booking: ServiceBooking = {
      id: crypto.randomUUID(),
      serviceId: body.serviceId,
      serviceName: body.serviceName,
      userId: auth.sub,
      userName: body.userName || auth.name,
      userPhone: body.userPhone,
      branchId: body.branchId,
      branchName: body.branchName,
      date: body.date,
      timeSlot: body.timeSlot,
      vehicleInfo: body.vehicleInfo,
      notes: body.notes,
      status: "pending",
      price: body.price,
      createdAt: new Date().toISOString(),
    };
    if (!booking.serviceId || !booking.branchId || !booking.date || !booking.timeSlot) {
      return fail("Service, branch, date and time are required");
    }
    const created = await createBooking(booking);
    await logActivityFromRequest(request, {
      action: "booking.create",
      category: "booking",
      message: `Service booking: ${booking.serviceName} on ${booking.date}`,
      ...actorFromJwt(auth),
      entityType: "booking",
      entityId: created.id,
      metadata: {
        serviceName: booking.serviceName,
        branchName: booking.branchName,
        date: booking.date,
        timeSlot: booking.timeSlot,
      },
    });
    return ok(created, 201);
  } catch (e) {
    await logActivityFromRequest(request, {
      action: "booking.create",
      category: "booking",
      status: "failure",
      message: "Service booking failed",
      ...actorFromJwt(auth),
      entityType: "booking",
    });
    return fail(e instanceof Error ? e.message : "Booking failed", 500);
  }
}
