export function formatDate(dateString: string | undefined): string {
  if (!dateString) {
    // console.warn("formatDate received an undefined or empty dateString");
    return "Invalid date"; // Or some other placeholder
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    // console.warn(`formatDate received an invalid dateString: ${dateString}`);
    return "Invalid date"; // Or some other placeholder
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
