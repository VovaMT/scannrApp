const API_BASE_URL = 'http://10.0.25.61.4:8080';

export const registerUser = async (name, key) => {
  const response = await fetch(`${API_BASE_URL}/registration`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, key }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Помилка реєстрації');
  }

  return true;
};

export const checkLicense = async (key) => {
  const response = await fetch(`${API_BASE_URL}/check-license?key=${key}`);
  if (!response.ok) throw new Error('Помилка перевірки ліцензії');
  return await response.json();
};
