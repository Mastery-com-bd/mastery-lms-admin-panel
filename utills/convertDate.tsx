export const convertDate = (date: Date) => {
  const convertDate = new Date(date);
  const creationDate = convertDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const creationTime = convertDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return { creationDate, creationTime };
};
