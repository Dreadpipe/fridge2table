
// Add Days to a Date - based on a function by Joel Coehoorn at Stack Overflow - Source: "https://stackoverflow.com/questions/563406/add-days-to-javascript-date"
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Subtract Days from a Date
const subtractDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

//--------------------------------

module.exports = {
  addDays,
  subtractDays,
};
