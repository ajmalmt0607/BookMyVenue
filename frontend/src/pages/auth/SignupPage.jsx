import SignupShowcase from "../../components/auth/SignupShowcase";
import SignupForm from "../../components/auth/SignupForm";
import useAuthMode from "../../hooks/useAuthMode";

const SignupPage = () => {
  const mode = useAuthMode();

  return (
    <>

      <section
        className="
          max-w-7xl
          mx-auto
          px-8
          py-12
        "
      >
        <div
          className="
            grid
            lg:grid-cols-2
            gap-16
            items-center
          "
        >
          <SignupShowcase mode={mode} />

          <SignupForm mode={mode} />
        </div>
      </section>
    </>
  );
};

export default SignupPage;
