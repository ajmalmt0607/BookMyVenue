import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import OwnerVenueCard from "../../components/owner/OwnerVenueCard";
import OwnerEmptyState from "../../components/owner/dashboard/OwnerEmptyState";
import VenueCardSkeleton from "../../components/venue/VenueCardSkeleton";

import {
  createVenueDraft,
  deleteVenueDraft,
  getOwnerVenues,
} from "../../services/venueDraftService";
import { wizardStepPath } from "../../constants/wizardSteps";

const VenueManagementPage = () => {
  const navigate = useNavigate();

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getOwnerVenues()
      .then((response) => {
        if (isMounted) setVenues(response.data);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreate = async () => {
    try {
      setCreating(true);

      // An owner can have multiple drafts alongside pending/approved
      // venues, so this always starts a brand new one - resuming an
      // existing draft happens from that draft's own card instead.
      const draft = await createVenueDraft();

      navigate(wizardStepPath(draft.id, "basic_information"));
    } catch (error) {
      console.error(error);
      setCreating(false);
    }
  };

  const handleDelete = async (venue) => {
    if (
      !window.confirm(
        `Delete "${venue.name || "this draft"}"? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeletingId(venue.id);
      await deleteVenueDraft(venue.id);
      setVenues((prev) => prev.filter((v) => v.id !== venue.id));
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Venue Management
          </h1>
          <p className="mt-1 text-gray-500">
            Manage your listed venues, or create a new one.
          </p>
        </div>

        {venues.length > 0 && (
          <button
            type="button"
            onClick={handleCreate}
            disabled={creating}
            className="
              flex shrink-0 items-center gap-2 rounded-xl bg-red-600
              px-5 py-3 text-sm font-semibold text-white
              transition-all duration-200 ease-out
              hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md
              disabled:opacity-60
            "
          >
            <Plus size={18} />
            {creating ? "Loading..." : "Create Venue"}
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <VenueCardSkeleton key={index} />
          ))}
        </div>
      ) : venues.length === 0 ? (
        <OwnerEmptyState onAction={handleCreate} actionLoading={creating} />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {venues.map((venue) => (
            <OwnerVenueCard
              key={venue.id}
              venue={venue}
              onDelete={handleDelete}
              deleting={deletingId === venue.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VenueManagementPage;
