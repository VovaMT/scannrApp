const API_URL = "http://192.168.0.211:8080/goods";

export const fetchGoods = async (deviceKey) => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Device-Key": deviceKey,
    },
  });

  if (!response.ok) {
    const errorObj = await response.json();
    throw new Error(errorObj.error || "Помилка при отриманні даних з сервера");
  }

  return await response.json();
};

