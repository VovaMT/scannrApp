import { API_BASE_URL } from './apiConfig';
import { GOODS_ENDPOINTS } from './urls';

export const fetchGoods = async (deviceKey,licenseKey) => {
  const response = await fetch(`${API_BASE_URL}${GOODS_ENDPOINTS.GET_GOODS}`, {
    method: "GET",
    headers: {
      "Device-Key": deviceKey,
      "License-Key": licenseKey,
    },
  });

  if (!response.ok) {
    const errorObj = await response.json();
    throw new Error(errorObj.error || "Помилка при отриманні даних з сервера");
  }

  return await response.json();
};
