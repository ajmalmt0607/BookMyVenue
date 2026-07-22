import SignupShowcase from "../../components/auth/SignupShowcase";
import LoginForm from "../../components/auth/LoginForm";
import useAuthMode from "../../hooks/useAuthMode";

const LoginPage = () => {
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

          <LoginForm mode={mode} />
        </div>
      </section>
    </>
  );
};

export default LoginPage;
