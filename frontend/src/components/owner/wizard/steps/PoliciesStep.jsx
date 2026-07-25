import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import WizardFooter from "../WizardFooter";

import {
  POLICY_ICON_MAP,
  DEFAULT_POLICY_ICON,
} from "../../../../constants/policyIcons";
import { getPolicyTypes } from "../../../../services/venueService";
import { updateVenuePolicies } from "../../../../services/venueDraftService";
import useStepSave from "../../../../hooks/useStepSave";

const toEditable = (venue) =>
  (venue?.policies || []).map((policy, index) => ({
    policy_type_id: policy.policy_type.id,
    content: policy.content,
    display_order: policy.display_order ?? index + 1,
  }));

const PoliciesStep = ({ venue, venueId, onBack, onContinue }) => {
  const [policyTypes, setPolicyTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [policies, setPolicies] = useState(() => toEditable(venue));
  const [error, setError] = useState("");

  const { saving, justSaved, save } = useStepSave((updatedPolicies) =>
    onContinue({ policies: updatedPolicies })
  );

  useEffect(() => {
    let isMounted = true;

    getPolicyTypes()
      .then((data) => {
        if (isMounted) setPolicyTypes(data);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoadingTypes(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const usedTypeIds = policies.map((policy) => policy.policy_type_id);

  const availableTypesFor = (currentTypeId) =>
    policyTypes.filter(
      (type) => type.id === currentTypeId || !usedTypeIds.includes(type.id)
    );

  const addPolicy = () => {
    const nextType = policyTypes.find(
      (type) => !usedTypeIds.includes(type.id)
    );

    if (!nextType) return;

    setPolicies((prev) => [
      ...prev,
      {
        policy_type_id: nextType.id,
        content: "",
        display_order: prev.length + 1,
      },
    ]);
  };

  const updatePolicy = (index, changes) => {
    setPolicies((prev) =>
      prev.map((policy, i) => (i === index ? { ...policy, ...changes } : policy))
    );
  };

  const removePolicy = (index) => {
    setPolicies((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContinue = async () => {
    if (policies.some((policy) => !policy.content.trim())) {
      setError("Add content for every policy, or remove it.");
      return;
    }

    setError("");

    try {
      await save(() => updateVenuePolicies(venueId, policies));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            House rules &amp; policies
          </h2>
          <p className="mt-1.5 text-gray-500">
            Set expectations upfront. It's fine to skip this if none apply.
          </p>
        </div>

        {loadingTypes ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, index) => (
              <div
                key={index}
                className="h-32 w-full animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {policies.map((policy, index) => {
              const type = policyTypes.find(
                (t) => t.id === policy.policy_type_id
              );
              const Icon = POLICY_ICON_MAP[type?.icon] || DEFAULT_POLICY_ICON;

              return (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-100 bg-white p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                        <Icon size={16} />
                      </span>

                      <select
                        value={policy.policy_type_id}
                        onChange={(event) =>
                          updatePolicy(index, {
                            policy_type_id: event.target.value,
                          })
                        }
                        className="rounded-lg bg-transparent text-sm font-bold text-gray-900 outline-none"
                      >
                        {availableTypesFor(policy.policy_type_id).map(
                          (type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => removePolicy(index)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <textarea
                    value={policy.content}
                    onChange={(event) =>
                      updatePolicy(index, { content: event.target.value })
                    }
                    rows={2}
                    placeholder="Describe this policy for your guests..."
                    className="
                      mt-3 w-full rounded-xl border border-gray-200 bg-gray-50
                      p-3 text-sm outline-none transition-all
                      focus:border-red-500 focus:bg-white
                    "
                  />
                </div>
              );
            })}

            {policies.length < policyTypes.length && (
              <button
                type="button"
                onClick={addPolicy}
                className="
                  flex w-full items-center justify-center gap-2 rounded-2xl
                  border-2 border-dashed border-gray-200 py-4 text-sm
                  font-semibold text-gray-500 transition-colors duration-200
                  hover:border-red-300 hover:text-red-600
                "
              >
                <Plus size={16} />
                Add Policy
              </button>
            )}
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <WizardFooter
        onBack={onBack}
        saving={saving}
        justSaved={justSaved}
        continueDisabled={justSaved}
        onContinue={handleContinue}
      />
    </div>
  );
};

export default PoliciesStep;
