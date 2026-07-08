import {
  useEffect,
  useState,
} from "react";

import {
  User,
  Phone,
  FileText,
} from "lucide-react";

const CustomerDetailsForm = ({
  booking,
  onSubmit,
  loading,
}) => {

  const [formData, setFormData] =
    useState({
      full_name: "",
      phone_number: "",
      alternate_phone_number: "",
      special_requirements: "",
    });

  const [errors, setErrors] =
    useState({});

  useEffect(() => {

    if (!booking) return;

    setFormData({
      full_name:
        booking.full_name || "",

      phone_number:
        booking.phone_number || "",

      alternate_phone_number:
        booking.alternate_phone_number || "",

      special_requirements:
        booking.special_requirements || "",
    });

  }, [booking]);

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {

      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));

    }

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    onSubmit(
      formData,
      setErrors
    );

  };

  return (

    <form
      id="customer-details-form"
      onSubmit={handleSubmit}
      className="
        bg-white
        border
        border-gray-100
        rounded-3xl
        p-6
        shadow-sm
      "
    >

      <h2
        className="
          text-xl
          font-bold
        "
      >
        Personal Information
      </h2>

      <p
        className="
          text-gray-500
          mt-1
          text-sm
        "
      >
        Please provide your contact details for the booking.
      </p>

      {/* Full Name */}

      <div className="mt-8">

        <label
          className="
            block
            text-sm
            font-medium
            mb-2
          "
        >
          Full Name
        </label>

        <div
          className={`
            flex
            items-center
            border-2
            rounded-xl
            px-3
            h-10

            ${
              errors.full_name
                ? "border-red-500"
                : "border-gray-200"
            }
          `}
        >

          <User
            size={18}
            className="
              text-gray-400
            "
          />

          <input
            type="text"
            name="full_name"
            value={
              formData.full_name
            }
            onChange={
              handleChange
            }
            placeholder="Full Name"
            className="
              flex-1
              ml-3
              outline-none
              text-sm
            "
          />

        </div>

        {errors.full_name && (

          <p
            className="
              text-red-500
              text-sm
              mt-2
            "
          >
            {errors.full_name[0]}
          </p>

        )}

      </div>

      {/* Phone Numbers */}

      <div
        className="
          grid
          md:grid-cols-2
          gap-5
          mt-5
        "
      >

        {/* Phone */}

        <div>

          <label
            className="
              block
              text-sm
              font-medium
              mb-2
            "
          >
            Phone Number
          </label>

          <div
            className={`
              flex
              items-center
              border-2
              rounded-xl
              px-3
              h-10

              ${
                errors.phone_number
                  ? "border-red-500"
                  : "border-gray-200"
              }
            `}
          >

            <Phone
              size={18}
              className="
                text-gray-400
              "
            />

            <input
              type="text"
              name="phone_number"
              value={
                formData.phone_number
              }
              onChange={
                handleChange
              }
              className="
                flex-1
                ml-3
                outline-none
                text-sm
              "
            />

          </div>

          {errors.phone_number && (

            <p
              className="
                text-red-500
                text-sm
                mt-2
              "
            >
              {errors.phone_number[0]}
            </p>

          )}

        </div>

        {/* Alternate Phone */}

        <div>

          <label
            className="
              block
              text-sm
              font-medium
              mb-2
            "
          >
            Alternate Phone
          </label>

          <div
            className={`
              flex
              items-center
              border-2
              rounded-xl
              px-3
              h-10

              ${
                errors.alternate_phone_number
                  ? "border-red-500"
                  : "border-gray-200"
              }
            `}
          >

            <Phone
              size={18}
              className="
                text-gray-400
              "
            />

            <input
              type="text"
              name="alternate_phone_number"
              value={
                formData.alternate_phone_number
              }
              onChange={
                handleChange
              }
              placeholder="Optional"
              className="
                flex-1
                ml-3
                outline-none
                text-sm
              "
            />

          </div>

          {errors.alternate_phone_number && (

            <p
              className="
                text-red-500
                text-sm
                mt-2
              "
            >
              {errors.alternate_phone_number[0]}
            </p>

          )}

        </div>

      </div>

      {/* Special Requirements */}

      <div className="mt-6">

        <label
          className="
            block
            text-sm
            font-medium
            mb-2
          "
        >
          Special Requirements
        </label>

        <div
          className={`
            border-2
            rounded-xl
            p-3

            ${
              errors.special_requirements
                ? "border-red-500"
                : "border-gray-200"
            }
          `}
        >

          <div
            className="
              flex
              items-start
            "
          >

            <FileText
              size={18}
              className="
                text-gray-400
                mt-1
              "
            />

            <textarea
              rows={5}
              name="special_requirements"
              value={
                formData.special_requirements
              }
              onChange={
                handleChange
              }
              maxLength={300}
              placeholder="Any special requirements..."
              className="
                flex-1
                ml-3
                outline-none
                resize-none
                text-sm
              "
            />

          </div>

          <div
            className="
              text-right
              text-xs
              text-gray-400
              mt-2
            "
          >
            {
              formData
                .special_requirements
                .length
            }
            /300
          </div>

        </div>

        {errors.special_requirements && (

          <p
            className="
              text-red-500
              text-sm
              mt-2
            "
          >
            {errors.special_requirements[0]}
          </p>

        )}

      </div>

      <button
        type="submit"
        disabled={loading}
        className="hidden"
      />

    </form>

  );

};

export default CustomerDetailsForm;