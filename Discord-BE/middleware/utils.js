function formatCurrency(amount) {
  // Ensure the amount is a number
  const numAmount = Number(amount);
  if (isNaN(numAmount)) {
    return "Invalid number";
  }

  // Format the number with commas as thousand separators
  const formattedAmount = numAmount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return formattedAmount;
}

function formatAsVietnameseDate(date) {
  // Ensure the date is a valid date
  if (isNaN(Date.parse(date))) {
    return "Invalid date";
  }

  // Format the date
  const formattedDate = new Date(date).toLocaleDateString("vi-VN");

  return formattedDate;
}

function formatAsSQLDatetime(date) {
  // Ensure the date is a valid date
  if (isNaN(Date.parse(date))) {
    return "Invalid date";
  }

  // Format the date as SQL datetime
  const formattedDate = new Date(date)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  return formattedDate;
}

function formatAsSQLDate(date) {
  // Chuyển đổi giá trị số nguyên thành đối tượng Date nếu cần thiết
  const dateObj =
    typeof date === "number" ? new Date(date) 
    : new Date(Date.parse(date));

  // Ensure the date is a valid date
  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  // Format the date as "YYYY-MM-DD"
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

const convertToSQLDate = (inputDate) => {
  const [day, month, year] = inputDate.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};


module.exports = {
  formatCurrency,
  formatAsVietnameseDate,
  formatAsSQLDatetime,
  formatAsSQLDate,
  convertToSQLDate
};
