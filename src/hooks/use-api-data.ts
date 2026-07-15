"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import type {
  Product,
  Category,
  Brand,
  VehicleMake,
  BlogPost,
  Service,
  Store,
  Order,
  ServiceBooking,
  Review,
} from "@/types";

export function useApiData<T>(
  fetcher: () => Promise<{ success: boolean; data?: T }>,
  fallback: T,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetcher()
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.data !== undefined) setData(res.data);
        else setError("Failed to load data");
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}

export function useCategories() {
  return useApiData<Category[]>(() => api.categories(), []);
}

export function useBrands() {
  return useApiData<Brand[]>(() => api.brands(), []);
}

export function useVehicleMakes() {
  return useApiData<VehicleMake[]>(() => api.vehicles(), []);
}

export function useServices() {
  return useApiData<Service[]>(() => api.services(), []);
}

export function useStores() {
  return useApiData<Store[]>(() => api.stores(), []);
}

export function useBlogPosts() {
  return useApiData<BlogPost[]>(() => api.blogs(), []);
}

export function useProducts(params?: Record<string, string>) {
  const key = JSON.stringify(params || {});
  return useApiData<Product[]>(() => api.products(params), [], [key]);
}

export function useReviews(productId?: string) {
  return useApiData<Review[]>(() => api.reviews(productId), [], [productId]);
}

export function useOrders() {
  return useApiData<Order[]>(() => api.orders(), []);
}

export function useBookings() {
  return useApiData<ServiceBooking[]>(() => api.bookings(), []);
}
