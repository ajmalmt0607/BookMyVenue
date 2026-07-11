// Reusable shimmer block: a gray base with a light sweep animated across it.
// Used for card/image/text skeletons wherever data is still loading.
const Shimmer = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-gray-200 ${className}`}>
    <div
      className="
        absolute inset-0 -translate-x-full animate-shimmer
        bg-linear-to-r from-transparent via-white/70 to-transparent
      "
    />
  </div>
);

export default Shimmer;
