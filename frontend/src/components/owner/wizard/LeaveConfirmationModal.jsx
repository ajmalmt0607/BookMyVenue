import { Trash2 } from "lucide-react";

import Modal from "../../ui/Modal";

const LeaveConfirmationModal = ({
  isOpen,
  discarding,
  onContinueEditing,
  onSaveAndLeave,
  onDiscard,
}) => (
  <Modal isOpen={isOpen}>
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
      <h2 className="text-xl font-bold text-gray-900">Leave venue setup?</h2>

      <p className="mt-2 text-gray-500">
        Your progress has been automatically saved. Would you like to
        continue editing later, or discard this draft permanently?
      </p>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={onContinueEditing}
          className="
            w-full rounded-xl bg-red-600 py-3 text-sm font-semibold
            text-white transition-all duration-200 ease-out
            hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md
          "
        >
          Continue Editing
        </button>

        <button
          type="button"
          onClick={onSaveAndLeave}
          className="
            w-full rounded-xl border border-gray-200 py-3 text-sm
            font-semibold text-gray-700 transition-colors duration-200
            hover:bg-gray-50
          "
        >
          Save Draft &amp; Leave
        </button>
      </div>

      <div className="mt-4 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onDiscard}
          disabled={discarding}
          className="
            flex w-full items-center justify-center gap-2 rounded-xl
            py-2.5 text-sm font-semibold text-red-600
            transition-colors duration-200
            hover:bg-red-50 disabled:opacity-60
          "
        >
          <Trash2 size={15} />
          {discarding ? "Discarding..." : "Discard Draft"}
        </button>
      </div>
    </div>
  </Modal>
);

export default LeaveConfirmationModal;
