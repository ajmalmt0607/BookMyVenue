import {
  ShieldCheck,
  CalendarCheck,
  Star,
} from "lucide-react";

const AuthBanner = () => {
  return (
    <div
      className="
        hidden
        lg:flex
        flex-col
        justify-between
        bg-red-600
        text-white
        p-12
      "
    >
      <div>
        <h1 className="text-5xl font-bold leading-tight">
          Find & Book
          <br />
          The Perfect Venue
        </h1>

        <p
          className="
            mt-6
            text-lg
            text-red-100
            max-w-md
          "
        >
          Discover verified venues for weddings,
          birthdays, corporate events and special
          occasions.
        </p>
      </div>

      <div className="space-y-6">

        <div className="flex items-center gap-3">
          <ShieldCheck size={22} />
          <span>500+ Verified Venues</span>
        </div>

        <div className="flex items-center gap-3">
          <CalendarCheck size={22} />
          <span>Instant Booking Confirmation</span>
        </div>

        <div className="flex items-center gap-3">
          <Star size={22} />
          <span>Rated 4.9 by Customers</span>
        </div>

      </div>

      <div
        className="
          grid
          grid-cols-2
          gap-6
          mt-10
        "
      >
        <div>
          <h3 className="text-3xl font-bold">
            10K+
          </h3>

          <p className="text-red-100">
            Events Hosted
          </p>
        </div>

        <div>
          <h3 className="text-3xl font-bold">
            4.9★
          </h3>

          <p className="text-red-100">
            Customer Rating
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthBanner;