import AdminFilterModal from "../shared/AdminFilterModal";

type BookingFiltersModalProps = {
  label: string;
  statuses: string[];
  theaters: string[];
  status: string;
  time: string;
  theater: string;
  onStatusChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onTheaterChange: (value: string) => void;
  onClear: () => void;
  onClose: () => void;
};

const TIME_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

function titleCase(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export default function BookingFiltersModal({
  label,
  statuses,
  theaters,
  status,
  time,
  theater,
  onStatusChange,
  onTimeChange,
  onTheaterChange,
  onClear,
  onClose,
}: BookingFiltersModalProps) {
  return (
    <AdminFilterModal
      title={`Filter ${label} bookings`}
      subtitle="Click a chip to apply the filter immediately."
      onClear={onClear}
      onClose={onClose}
      sections={[
        {
          title: "Booking status",
          value: status,
          allLabel: "All statuses",
          options: statuses.map((item) => ({ value: item, label: titleCase(item) })),
          onSelect: onStatusChange,
        },
        {
          title: "Time range",
          value: time,
          allLabel: "All time",
          options: TIME_OPTIONS,
          onSelect: onTimeChange,
        },
        {
          title: "Venue",
          value: theater,
          allLabel: "All venues",
          options: theaters.map((item) => ({ value: item, label: item })),
          onSelect: onTheaterChange,
        },
      ]}
    />
  );
}
