import { API_BASE_URL } from './apiConfig';
import { AUTH_ENDPOINTS } from './urls';

export const registerUser = async (name, key) => {
  const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.REGISTER}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, key }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Помилка реєстрації");
  }

  return data.keyLicense; // повертаємо токен
};



export const validateUser  = async (key, licenseKey) => {
  const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.USER_VALIDATE}`, {
    method: "POST",
    headers: {
      "Device-Key": key,
      "License-Key": licenseKey,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Помилка перевірки ліцензії");
  }

  return true;
};

export const getUserInfo = async (key, licenseKey) => {
  const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.GET_USER_INFO}`, {
    method: "GET",
    headers: {
      "Device-Key": key,
      "License-Key": licenseKey,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Не вдалося отримати дані користувача");
  }

  return data; // { name, role, keyLicense, store | stores }
};



// Отримати ліцензію за ключем (deviceId)
export const getUserLicenseInfo = async (key) => {
  const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.CHECK_LICENSE}?key=${key}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Помилка отримання ліцензії");
  }

  return data.keyLicense;
};



export const getUserStores = async (key, licenseKey) => {
  const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.GET_STORES}`, {
    method: "GET",
    headers: {
      "Device-Key": key,
      "License-Key": licenseKey,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Помилка отримання магазинів");
  }

  return data; 
};

export const setActiveStore = async (storeId, key, licenseKey) => {
  const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.SET_ACTIVE_STORE}?storeId=${storeId}`, {
    method: "POST",
    headers: {
      "Device-Key": key,
      "License-Key": licenseKey,
    },
  });

  if (!response.ok) {
    throw new Error("Не вдалося встановити магазин");
  }

  return true;
};





