import { memo, useState } from "react";
import { ChevronDown } from "lucide-react";

// Mock Q&A until a real FAQ API exists.
const FAQ_ITEMS = [
  {
    question: "How do I book this venue?",
    answer:
      "Select a date and time slot, then click Continue Booking to reserve your spot. You'll have a few minutes to complete payment before the reservation expires.",
  },
  {
    question: "Can I cancel or reschedule my booking?",
    answer:
      "Cancellation and rescheduling terms are listed in the Things to Know section above under Cancellation Policy.",
  },
  {
    question: "Is outside catering allowed?",
    answer:
      "This depends on the venue's Outside Food policy — check the Things to Know section for this venue's specific rules.",
  },
  {
    question: "Do I need to pay the full amount upfront?",
    answer:
      "Yes, bookings are confirmed once payment is completed in full through our secure checkout.",
  },
];

const FAQItem = ({ item, isOpen, onToggle }) => (
  <div className="border-b border-gray-100 last:border-0">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="flex w-full items-center justify-between gap-4 py-4 text-left"
    >
      <span className="font-semibold text-gray-900">{item.question}</span>

      <ChevronDown
        size={18}
        className={`
          shrink-0 text-gray-400 transition-transform duration-200 ease-out
          ${isOpen ? "rotate-180" : ""}
        `}
      />
    </button>

    {isOpen && (
      <p className="pb-4 text-sm leading-relaxed text-gray-600">
        {item.answer}
      </p>
    )}
  </div>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900">
        Frequently Asked Questions
      </h2>

      <div className="mt-6 rounded-2xl border border-gray-100 px-5">
        {FAQ_ITEMS.map((item, index) => (
          <FAQItem
            key={item.question}
            item={item}
            isOpen={openIndex === index}
            onToggle={() =>
              setOpenIndex((prev) => (prev === index ? -1 : index))
            }
          />
        ))}
      </div>
    </section>
  );
};

export default memo(FAQSection);
