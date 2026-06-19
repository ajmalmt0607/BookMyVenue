import SignupShowcase from "../../components/auth/SignupShowcase";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
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
          <SignupShowcase />

          <LoginForm />
        </div>
      </section>
    </>
  );
};

export default LoginPage;