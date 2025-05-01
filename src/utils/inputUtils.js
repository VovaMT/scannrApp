export const validateQuantityInput = (text, isWeightGood, max = 10000) => {
  // Заміна коми на крапку
  const formatted = text.replace(",", ".");

  // Дозволяємо лише цифри
  if (!/^\d*\.?\d*$/.test(formatted)) return null;

  // Обмежуємо кількість знаків після крапки для вагового
  if (isWeightGood && formatted.includes(".")) {
    const [, decimalPart] = formatted.split(".");
    if (decimalPart.length > 3) return null;
  }

  // Для штучного тільки цілі числа 
  if (!isWeightGood && formatted.includes(".")) {
    return null;
  }

  // Дозволяємо очищення поля
  if (formatted === "") return "";

  // Перевірка числового значення в межах
  const parsed = parseFloat(formatted);
  if (!isNaN(parsed) && parsed >= 0 && parsed <= max) return formatted;

  return null;
};
