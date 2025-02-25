import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const formatter = new Intl.DateTimeFormat('en-GB'); 
function formattedDate(date) {
  const format_date = new Date(date);
  return formatter.format(format_date);
}



function currencyFormatted(amount) {
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
};

export { formattedDate, currencyFormatted };