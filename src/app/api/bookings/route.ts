import { getBookings, createBooking } from "@/lib/data/repositories";
import { ok, fail, requireAuth } from "@/lib/api/helpers";
import type { ServiceBooking } from "@/types";

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
    return ok(await createBooking(booking), 201);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Booking failed", 500);
  }
}
