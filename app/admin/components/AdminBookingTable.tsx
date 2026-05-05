"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import BookingDetailsModal from "./adminBookings/BookingDetailsModal";
import BookingFiltersModal from "./adminBookings/BookingFiltersModal";
import BookingsDataTable from "./adminBookings/BookingsDataTable";
import { TYPE_LABELS } from "./adminBookings/constants";
import type { BookingResponse, BookingRow, BookingType } from "./adminBookings/types";

export default function AdminBookingTable({ type }: { type: BookingType }) {
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [theaters, setTheaters] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<BookingResponse["pagination"] | null>(null);
  const [status, setStatus] = useState("");
  const [time, setTime] = useState("");
  const [theater, setTheater] = useState("");
  const [selectedRow, setSelectedRow] = useState<BookingRow | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (status) params.set("status", status);
    if (time) params.set("time", time);
    if (theater) params.set("theater", theater);
    return params.toString();
  }, [page, status, theater, time]);

  useEffect(() => {
    let active = true;

    async function loadBookings() {
      setLoading(true);
      setError("");

      try {
        const payload = await apiFetch(`/admin/bookings/${type}?${query}`, {
          notifyOnError: false,
        }) as BookingResponse;

        if (!active) return;
        setRows(payload.data || []);
        setStatuses(payload.filters?.statuses || []);
        setTheaters(payload.filters?.theaters || []);
        setPagination(payload.pagination || null);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load bookings");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadBookings();

    return () => {
      active = false;
    };
  }, [query, type]);

  const activeFilterCount = [status, time, theater].filter(Boolean).length;
  const label = TYPE_LABELS[type];

  const openFilters = () => {
    setFiltersOpen(true);
  };

  const updateStatus = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const updateTime = (value: string) => {
    setTime(value);
    setPage(1);
  };

  const updateTheater = (value: string) => {
    setTheater(value);
    setPage(1);
  };

  const clearFilters = () => {
    setStatus("");
    setTime("");
    setTheater("");
    setPage(1);
  };

  return (
    <section style={{ display: "grid", gap: 18 }}>
      <BookingsDataTable
        label={label}
        rows={rows}
        loading={loading}
        error={error}
        page={page}
        pagination={pagination}
        activeFilterCount={activeFilterCount}
        onOpenFilters={openFilters}
        onPreviousPage={() => setPage((value) => Math.max(value - 1, 1))}
        onNextPage={() => setPage((value) => value + 1)}
        onViewRow={setSelectedRow}
      />

      {selectedRow && (
        <BookingDetailsModal row={selectedRow} onClose={() => setSelectedRow(null)} />
      )}

      {filtersOpen && (
        <BookingFiltersModal
          label={label}
          statuses={statuses}
          theaters={theaters}
          status={status}
          time={time}
          theater={theater}
          onStatusChange={updateStatus}
          onTimeChange={updateTime}
          onTheaterChange={updateTheater}
          onClear={clearFilters}
          onClose={() => setFiltersOpen(false)}
        />
      )}
    </section>
  );
}
