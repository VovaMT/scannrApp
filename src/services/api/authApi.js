import { API_BASE_URL } from './apiConfig';
import { AUTH_ENDPOINTS } from './urls';

export const registerUser = async (name, key) => {
  const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.REGISTER}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, key }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Помилка реєстрації");
  }

  return true;
};


export const checkLicense = async (key) => {
  const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.CHECK_LICENSE}?key=${key}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Помилка перевірки ліцензії");
  }
  return true;
};

export const getUserInfoByKey = async (key) => {
  const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.GET_USER}?key=${key}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Помилка отримання даних користувача");
  }
  return await response.json(); // { name: "Ім'я", key: "ключ", licensed: true }
};
