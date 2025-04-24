const API_URL = "http://10.0.25.51:8080/goods";

export const fetchGoods = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Помилка при отриманні даних з сервера");
  }

  const goods = await response.json();
  return goods;
};
