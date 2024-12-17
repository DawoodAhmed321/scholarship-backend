function getCurrentWeeksMonday() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const currentWeeksMonday = new Date(today);

  // Calculate the number of days to subtract to get to the current week's Monday
  const daysToSubtract = (dayOfWeek + 6) % 7;
  currentWeeksMonday.setDate(today.getDate() - daysToSubtract);

  currentWeeksMonday.setUTCHours(0, 0, 0, 0);

  return currentWeeksMonday;
}

function getPreviousWeeksMonday() {
  const currentWeeksMonday = getCurrentWeeksMonday();
  const previousWeeksMonday = new Date(currentWeeksMonday);

  previousWeeksMonday.setDate(currentWeeksMonday.getDate() - 7);

  return previousWeeksMonday;
}

const currentWeekMonday = getCurrentWeeksMonday();
const previouseMonday = getPreviousWeeksMonday();

for (let i = 0; i < 7; i++) {
  const startDate = new Date(currentWeekMonday);
  startDate.setDate(currentWeekMonday.getDate() + i);
  const endDate = new Date(startDate);
  endDate.setUTCHours(23, 59, 59, 0);
  console.log(startDate, endDate);
}
