import {
  FileText,
  Phone,
  User,
} from "lucide-react";

const Field = ({
  icon: Icon,
  label,
  value,
}) => {

  return (
    <div
      className="
        flex
        items-start
        gap-3
      "
    >

      <Icon
        size={18}
        className="
          text-gray-400
          mt-0.5
        "
      />

      <div>

        <p
          className="
            text-xs
            text-gray-500
          "
        >
          {label}
        </p>

        <p
          className="
            font-semibold
            mt-1
          "
        >
          {value}
        </p>

      </div>

    </div>
  );

};

const CustomerInformationCard = ({
  booking,
}) => {

  return (
    <div
      className="
        bg-white
        border
        border-gray-100
        rounded-3xl
        p-6
        shadow-sm
        mt-6
      "
    >

      <h2
        className="
          text-xl
          font-bold
        "
      >
        Customer Details
      </h2>

      <div
        className="
          grid
          sm:grid-cols-2
          gap-5
          mt-6
        "
      >

        <Field
          icon={User}
          label="Full Name"
          value={booking.full_name}
        />

        <Field
          icon={Phone}
          label="Phone Number"
          value={booking.phone_number}
        />

        {booking.alternate_phone_number && (

          <Field
            icon={Phone}
            label="Alternate Phone Number"
            value={
              booking.alternate_phone_number
            }
          />

        )}

      </div>

      {booking.special_requirements && (

        <div
          className="
            border-t
            mt-6
            pt-6
            flex
            items-start
            gap-3
          "
        >

          <FileText
            size={18}
            className="
              text-gray-400
              mt-0.5
            "
          />

          <div>

            <p
              className="
                text-xs
                text-gray-500
              "
            >
              Special Requirements
            </p>

            <p
              className="
                font-medium
                mt-1
                text-gray-700
              "
            >
              {booking.special_requirements}
            </p>

          </div>

        </div>

      )}

    </div>
  );

};

export default CustomerInformationCard;
