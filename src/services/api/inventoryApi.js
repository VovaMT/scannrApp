import { API_BASE_URL } from './apiConfig';
import { INVENTORY_ENDPOINTS } from './urls';

export const syncInventory = async (inventoryItems, deviceKey) => {
  const response = await fetch(`${API_BASE_URL}${INVENTORY_ENDPOINTS.SYNC}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Device-Key": deviceKey,
    },
    body: JSON.stringify(inventoryItems),
  });

  if (!response.ok) {
    const errorObj = await response.json();
    throw new Error(errorObj.error || "Помилка при синхронізації інвентаризації");
  }

  return await response.json();
};
