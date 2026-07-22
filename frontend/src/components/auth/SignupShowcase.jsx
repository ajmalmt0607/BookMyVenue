import {
  ShieldCheck,
  Clock3,
  CalendarCheck,
  Quote,
  Star,
} from "lucide-react";

// import mainVenue from "../../assets/auth/main-venue.jpg";
import mainVenue from "../../assets/hero.png";
import weddingHall from "../../assets/auth/pic1.jpg";
import outdoorVenue from "../../assets/auth/pic2.jpg";
import conferenceRoom from "../../assets/auth/pic3.jpg";

const COPY = {
  customer: {
    headlineLead: "Create Your Account",
    headlineTail: "and Start Booking",
    headlineAccent: "Amazing Venues",
    paragraph:
      "Join BookMyVenue and discover, book and manage venues for any occasion — all in one place.",
    statValue: "10,000+",
    statLabel: "Happy Customers",
    testimonial:
      "BookMyVenue made it easy to find the perfect venue for our wedding.",
    testimonialName: "Priya Sharma",
  },
  owner: {
    headlineLead: "List Your Venue",
    headlineTail: "and Turn It Into a",
    headlineAccent: "Thriving Business",
    paragraph:
      "Join BookMyVenue as a venue owner and reach thousands of customers actively booking for every occasion.",
    statValue: "500+",
    statLabel: "Venues Listed",
    testimonial:
      "Listing our banquet hall on BookMyVenue doubled our bookings within months.",
    testimonialName: "Arjun Mehta, Venue Owner",
  },
};

const SignupShowcase = ({ mode = "customer" }) => {
  const copy = COPY[mode] ?? COPY.customer;

  return (
    <div
      className="
        hidden
        lg:flex
        flex-col
        justify-center
      "
    >
      {/* Heading */}

      <div className="mb-10">

        <h1
          className="
            text-4xl
            lg:text-4xl
            font-black
            leading-tight
            tracking-tight
          "
        >
          {copy.headlineLead}
          <br />

          {copy.headlineTail}{" "}

          <span className="text-red-600">
            {copy.headlineAccent}
          </span>
        </h1>

        <p
          className="
            mt-6
            text-xl
            text-gray-600
            max-w-2xl
          "
        >
          {copy.paragraph}
        </p>

      </div>

      {/* Features */}

      {/* <div
        className="
          flex
          items-center
          gap-8
          mb-10
        "
      >
        <FeatureItem
          icon={<ShieldCheck size={24} />}
          title="Trusted & Secure"
          text="Your data is safe with us."
        />

        <FeatureItem
          icon={<Clock3 size={24} />}
          title="Quick & Easy"
          text="Signup in less than a minute."
        />

        <FeatureItem
          icon={<CalendarCheck size={24} />}
          title="Exclusive Benefits"
          text="Priority support & offers."
        />
      </div> */}

      {/* Image Section */}

      <div
        className="
          grid
          grid-cols-[2fr_1fr]
          gap-4
          relative
        "
      >
        {/* Floating Stats Card */}

        <div
          className="
            absolute
            left-5
            top-6
            z-10
            bg-white
            shadow-xl
            rounded-3xl
            p-6
            w-52
          "
        >
          <h3
            className="
              text-2xl
              font-black
              text-red-600
            "
          >
            {copy.statValue}
          </h3>

          <p className="mt-1">
            {copy.statLabel}
          </p>

        </div>

        {/* Main Image */}

        <div className="relative">

          <img
            src={mainVenue}
            alt="Venue"
            className="
              w-full
              h-full
              object-cover
              rounded-[40px]
            "
          />

          {/* Testimonial */}

          <div
            className="
              absolute
              bottom-5
              left-5
              bg-white
              rounded-3xl
              p-6
              shadow-xl
              w-[320px]
            "
          >
            <Quote
              size={22}
              className="text-red-600"
            />

            <p
              className="
                text-sm
                mt-3
                text-gray-700
              "
            >
              {copy.testimonial}
            </p>

            <div className="mt-4">
              <p className="font-semibold">
                {copy.testimonialName}
              </p>

              <div
                className="
                  flex
                  gap-1
                  mt-2
                "
              >
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill="currentColor"
                    className="text-red-600"
                  />
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Images */}

        <div
          className="
            flex
            flex-col
            gap-4
          "
        >
          <img
            src={weddingHall}
            alt=""
            className="
              h-1/3
              object-cover
              rounded-3xl
            "
          />

          <img
            src={outdoorVenue}
            alt=""
            className="
              h-1/3
              object-cover
              rounded-3xl
            "
          />

          <img
            src={conferenceRoom}
            alt=""
            className="
              h-1/3
              object-cover
              rounded-3xl
            "
          />
        </div>

      </div>

    </div>
  );
};

export default SignupShowcase;

const FeatureItem = ({
  icon,
  title,
  text,
}) => {
  return (
    <div
      className="
        flex
        items-start
        gap-3
      "
    >
      <div
        className="
          h-12
          w-12
          rounded-full
          border
          border-red-200
          flex
          items-center
          justify-center
          text-red-600
        "
      >
        {icon}
      </div>

      <div>
        <h4
          className="
            font-semibold
            text-lg
          "
        >
          {title}
        </h4>

        <p
          className="
            text-gray-600
            text-sm
          "
        >
          {text}
        </p>
      </div>
    </div>
  );
};