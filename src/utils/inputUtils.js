export const validateQuantityInput = (text, max = 10000) => {
  const formatted = text.replace(",", ".");
  const parsed = parseFloat(formatted);

  if (formatted === "") {
    return ""; // дозволяємо очищення
  }

  if (!isNaN(parsed) && parsed >= 0 && parsed <= max) {
    return formatted;
  }

  return null; // недопустиме значення
};
