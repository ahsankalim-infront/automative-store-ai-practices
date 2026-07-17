"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import Image from "next/image";
import { ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

interface ProductImageZoomProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  onError?: () => void;
  className?: string;
  overlay?: ReactNode;
}

export function ProductImageZoom({
  src,
  alt,
  priority,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  onError,
  className,
  overlay,
}: ProductImageZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  useEffect(() => {
    setZoom(MIN_ZOOM);
    setPan({ x: 0, y: 0 });
  }, [src]);

  const clampPan = useCallback((nextPan: { x: number; y: number }, level: number) => {
    const el = containerRef.current;
    if (!el || level <= MIN_ZOOM) return { x: 0, y: 0 };

    const maxX = ((level - 1) * el.clientWidth) / 2;
    const maxY = ((level - 1) * el.clientHeight) / 2;
    return {
      x: Math.min(maxX, Math.max(-maxX, nextPan.x)),
      y: Math.min(maxY, Math.max(-maxY, nextPan.y)),
    };
  }, []);

  const zoomIn = () => {
    setZoom((prev) => {
      const next = Math.min(MAX_ZOOM, Math.round((prev + ZOOM_STEP) * 100) / 100);
      setPan((p) => clampPan(p, next));
      return next;
    });
  };

  const zoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(MIN_ZOOM, Math.round((prev - ZOOM_STEP) * 100) / 100);
      setPan((p) => clampPan(p, next));
      return next;
    });
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (zoom <= MIN_ZOOM) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging || zoom <= MIN_ZOOM) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan(clampPan({ x: dragStart.current.panX + dx, y: dragStart.current.panY + dy }, zoom));
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setDragging(false);
    }
  };

  const canZoomIn = zoom < MAX_ZOOM;
  const canZoomOut = zoom > MIN_ZOOM;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden",
        zoom > MIN_ZOOM && (dragging ? "cursor-grabbing" : "cursor-grab"),
        className
      )}
    >
      <div
        className="relative h-full w-full touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="relative h-full w-full will-change-transform"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: dragging ? "none" : "transform 0.2s ease-out",
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover select-none"
            priority={priority}
            sizes={sizes}
            draggable={false}
            onError={onError}
          />
        </div>
      </div>

      {overlay}

      <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-xl border border-border bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm shadow-md p-1">
        <button
          type="button"
          onClick={zoomOut}
          disabled={!canZoomOut}
          aria-label="Zoom out"
          className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <span className="min-w-[2.75rem] text-center text-xs font-semibold tabular-nums text-gray-600 dark:text-gray-300">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={zoomIn}
          disabled={!canZoomIn}
          aria-label="Zoom in"
          className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
