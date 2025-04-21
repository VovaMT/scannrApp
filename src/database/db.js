import { openDatabaseAsync } from 'expo-sqlite';

// Ініціалізація бази даних
let db;

const initDatabase = async () => {
  db = await openDatabaseAsync('goods.db');

  // Використовуємо execAsync для створення таблиці
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS goods (
      goodId INTEGER PRIMARY KEY NOT NULL,
      barCode TEXT,
      name TEXT,
      goodCode TEXT
    );
  `);
};

export const initDB = async () => {
  if (!db) await initDatabase();
};

export const clearGoods = async () => {
  if (!db) await initDatabase();

  // Видаляємо всі записи з таблиці goods
  await db.runAsync('DELETE FROM goods');
};

export const insertGoods = async (goods) => {
  if (!db) await initDatabase();

  // Використовуємо runAsync для вставки даних
  for (const item of goods) {
    await db.runAsync(
      `INSERT OR REPLACE INTO goods (goodId, barCode, name, goodCode)
       VALUES (?, ?, ?, ?);`,
      item.goodId,
      item.barCode,
      item.name,
      item.goodCode
    );
  }
};

export const getAllGoods = async () => {
  if (!db) await initDatabase();

  // Використовуємо getAllAsync для отримання всіх записів
  const allRows = await db.getAllAsync('SELECT * FROM goods');
  return allRows;
};

export const getGoodById = async (goodId) => {
  if (!db) await initDatabase();

  // Використовуємо getFirstAsync для отримання одного запису
  const row = await db.getFirstAsync('SELECT * FROM goods WHERE goodId = ?', goodId);
  return row;
};

export const deleteGoodById = async (goodId) => {
  if (!db) await initDatabase();

  // Використовуємо runAsync для видалення запису
  await db.runAsync('DELETE FROM goods WHERE goodId = ?', goodId);
};

export default db;