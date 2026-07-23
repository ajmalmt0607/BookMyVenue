import { Loader2 } from "lucide-react";

const FullPageLoader = () => {
  return (
    <div
      className="
        min-h-[60vh]
        flex
        items-center
        justify-center
      "
    >
      <Loader2
        size={32}
        className="
          animate-spin
          text-red-600
        "
      />
    </div>
  );
};

export default FullPageLoader;
