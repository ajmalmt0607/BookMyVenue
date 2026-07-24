import { useCallback, useEffect, useState } from "react";

import DashboardGreeting from "../../components/owner/dashboard/DashboardGreeting";
import KpiCardsGrid from "../../components/owner/dashboard/KpiCardsGrid";
import RecentBookingsCard from "../../components/owner/dashboard/RecentBookingsCard";
import OwnerEmptyState from "../../components/owner/dashboard/OwnerEmptyState";
import EmptyState from "../../components/common/EmptyState";

import { getOwnerDashboard } from "../../services/ownerService";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dashboard, setDashboard] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const data = await getOwnerDashboard();

      setDashboard(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (error) {
    return (
      <div className="space-y-6">
        <DashboardGreeting />

        <EmptyState
          title="Couldn't load your dashboard"
          description="Something went wrong while fetching your data."
          onRetry={fetchDashboard}
        />
      </div>
    );
  }

  const showEmptyState = !loading && dashboard?.has_venues === false;

  return (
    <div className="animate-fade-in-up space-y-6">
      <DashboardGreeting />

      {showEmptyState ? (
        <OwnerEmptyState />
      ) : (
        <>
          <KpiCardsGrid loading={loading} stats={dashboard?.stats} />

          <RecentBookingsCard
            loading={loading}
            bookings={dashboard?.recent_bookings || []}
          />
        </>
      )}
    </div>
  );
};

export default DashboardPage;
