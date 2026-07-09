export const getStatusBadgeClasses = (
  status
) => {

  switch (status) {

    case "CONFIRMED":
    case "SUCCESS":
      return "bg-green-50 text-green-700 border-green-200";

    case "RESERVED":
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "CANCELLED":
    case "FAILED":
      return "bg-red-50 text-red-700 border-red-200";

    case "EXPIRED":
      return "bg-gray-100 text-gray-600 border-gray-200";

    default:
      return "bg-gray-100 text-gray-600 border-gray-200";

  }

};
