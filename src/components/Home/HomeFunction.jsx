// Function to filter the array and find objects printed today
export const findPrintedToday = (array) => {
  // Get the current date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().slice(0, 10);

  // Filter the array to find objects confirmed today
  const printedToday = array?.filter((item) => {
    // Extract the date part from the confirm_time property
    const printedDate = item?.confirm_time?.slice(0, 10);
    // Check if the confirm date matches the current date
    return printedDate === currentDate;
  });

  return printedToday;
};

export const findShippedLast7Days = (array) => {
  // Get the current date (without time)
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set time to midnight

  // Calculate the date 7 days ago (without time)
  const sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(currentDate.getDate() - 7);

  // Filter the array to find objects shipped within the last 7 days
  const shippedLast7Days = array?.filter((item) => {
    // Extract the shipped date from the confirm_time string and convert to Date object
    const shippedDate = new Date(item?.confirm_time?.replace(/-/g, "/"));
    shippedDate.setHours(0, 0, 0, 0); // Set time to midnight for comparison

    // Check if the shipped date is after sevenDaysAgo and before or equal to currentDate
    return shippedDate >= sevenDaysAgo && shippedDate <= currentDate;
  });

  return shippedLast7Days;
};
