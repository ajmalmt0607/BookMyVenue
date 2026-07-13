import { memo, useState } from "react";

import { DEFAULT_POLICY_ICON, POLICY_ICON_MAP } from "../../constants/policyIcons";

const PolicyCard = ({ policy }) => {
  const [expanded, setExpanded] = useState(false);

  const Icon = POLICY_ICON_MAP[policy.policy_type.icon] || DEFAULT_POLICY_ICON;

  return (
    <div
      className="
        rounded-2xl border border-gray-200 p-5
        transition-colors duration-200 ease-out
        hover:border-gray-300
      "
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
        <Icon size={18} className="text-red-600" />
      </div>

      <h4 className="mt-4 font-bold text-gray-900">
        {policy.policy_type.name}
      </h4>

      {policy.policy_type.description && (
        <p className="mt-1.5 text-sm text-gray-500">
          {policy.policy_type.description}
        </p>
      )}

      {expanded && (
        <p className="mt-3 border-t border-gray-100 pt-3 text-sm leading-relaxed text-gray-700">
          {policy.content}
        </p>
      )}

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="
          mt-3 text-sm font-semibold text-red-600
          transition-colors duration-200 ease-out hover:text-red-700
        "
      >
        {expanded ? "Show less" : "View details"}
      </button>
    </div>
  );
};

export default memo(PolicyCard);
