"use client";

import Link from "next/link";
import { Calendar, MapPin, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { useBookings } from "@/hooks/use-api-data";

export default function UserBookingsPage() {
  const { data: bookings = [], loading } = useBookings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground">Service Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">PPF, detailing, and installation appointments.</p>
        </div>
        <Button asChild>
          <Link href="/services/book">Book New Service</Link>
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-500 py-12 text-center">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-10 w-10" />}
          title="No bookings yet"
          description="Schedule PPF, detailing, or installation at your nearest branch."
          action={{ label: "Book a Service", href: "/services/book" }}
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-card rounded-2xl border border-border p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                <h3 className="font-bold text-foreground">{booking.serviceName}</h3>
                <Badge variant={booking.status === "confirmed" ? "success" : booking.status === "pending" ? "warning" : "default"}>
                  {booking.status.toUpperCase()}
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-500">
                <div className="flex items-center gap-1.5 min-w-0">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span className="truncate">{booking.branchName.split(" - ")[1] || booking.branchName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary shrink-0" />
                  {booking.date}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  {booking.timeSlot}
                </div>
                {booking.vehicleInfo && (
                  <div className="flex items-center gap-1.5 min-w-0">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">{booking.vehicleInfo}</span>
                  </div>
                )}
              </div>
              {booking.price != null && (
                <p className="mt-3 text-base font-bold text-primary">Rs.{booking.price.toLocaleString()}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
