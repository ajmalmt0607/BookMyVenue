import {
  CalendarCheck,
  IndianRupee,
  Building2,
  Clock,
} from "lucide-react";

import KpiCard from "./KpiCard";
import KpiCardSkeleton from "./KpiCardSkeleton";

import { formatCurrency } from "../../../utils/formatText";

const GRID_CLASSES = "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4";

const KpiCardsGrid = ({ loading, stats }) => {
  if (loading || !stats) {
    return (
      <div className={GRID_CLASSES}>
        {[...Array(4)].map((_, index) => (
          <KpiCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      icon: CalendarCheck,
      label: "Monthly Bookings",
      value: stats.monthly_bookings,
    },
    {
      icon: IndianRupee,
      label: "Monthly Revenue",
      value: formatCurrency(stats.monthly_revenue),
    },
    {
      icon: Building2,
      label: "Total Venues",
      value: stats.total_venues,
    },
    {
      icon: Clock,
      label: "Pending Bookings",
      value: stats.pending_bookings,
    },
  ];

  return (
    <div className={GRID_CLASSES}>
      {cards.map((card) => (
        <KpiCard key={card.label} {...card} />
      ))}
    </div>
  );
};

export default KpiCardsGrid;
