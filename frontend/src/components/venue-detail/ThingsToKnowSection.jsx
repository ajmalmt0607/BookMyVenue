import { memo } from "react";

import PolicyCard from "./PolicyCard";

const ThingsToKnowSection = ({ policies = [] }) => {
  if (!policies.length) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900">Things to Know</h2>

      <p className="mt-1 text-gray-500">
        Cancellation, house rules, and other policies for this venue.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {policies.map((policy) => (
          <PolicyCard key={policy.id} policy={policy} />
        ))}
      </div>
    </section>
  );
};

export default memo(ThingsToKnowSection);
