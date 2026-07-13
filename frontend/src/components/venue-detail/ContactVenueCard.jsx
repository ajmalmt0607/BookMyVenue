import { memo, useState } from "react";
import { Check, Flag, MessageCircle, Phone, Share2 } from "lucide-react";

// Call/Message/Report are visual placeholders pending real contact data on
// Venue (phone number, messaging channel). Share is fully functional.
const CONTACT_ACTIONS = [
  { icon: Phone, label: "Call Venue" },
  { icon: MessageCircle, label: "Message" },
];

const ContactVenueCard = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: document.title,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User dismissed the native share sheet — nothing to do.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — nothing to do.
    }
  };

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6">
      <h3 className="font-bold text-gray-900">
        Have questions about this venue?
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Get in touch before you book.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {CONTACT_ACTIONS.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.label}
              type="button"
              className="
                flex items-center justify-center gap-2 rounded-xl
                border border-gray-200 py-3
                text-sm font-semibold text-gray-700
                transition-colors duration-200 ease-out
                hover:border-gray-300 hover:bg-gray-50
              "
            >
              <Icon size={16} />
              {action.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={handleShare}
          className="
            flex flex-1 items-center justify-center gap-2 rounded-xl
            border border-gray-200 py-3
            text-sm font-semibold text-gray-700
            transition-colors duration-200 ease-out
            hover:border-gray-300 hover:bg-gray-50
          "
        >
          {copied ? (
            <Check size={16} className="text-emerald-600" />
          ) : (
            <Share2 size={16} />
          )}
          {copied ? "Link Copied" : "Share"}
        </button>

        <button
          type="button"
          className="
            flex items-center justify-center gap-2 rounded-xl px-4 py-3
            text-sm font-medium text-gray-400
            transition-colors duration-200 ease-out hover:text-gray-600
          "
        >
          <Flag size={15} />
          Report
        </button>
      </div>
    </div>
  );
};

export default memo(ContactVenueCard);
