import { openDatabaseAsync } from 'expo-sqlite';

let db;

const initDatabase = async () => {
  db = await openDatabaseAsync('goods.db');

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

  await db.runAsync('DELETE FROM goods');
};

export const insertGoods = async (goods) => {
  if (!db) await initDatabase();

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

  const allRows = await db.getAllAsync('SELECT * FROM goods');
  return allRows;
};

export const getGoodById = async (goodId) => {
  if (!db) await initDatabase();

  const row = await db.getFirstAsync('SELECT * FROM goods WHERE goodId = ?', goodId);
  return row;
};

export const deleteGoodById = async (goodId) => {
  if (!db) await initDatabase();

  await db.runAsync('DELETE FROM goods WHERE goodId = ?', goodId);
};

export const getGoodByBarcode = async (barCode) => {
  if (!db) await initDatabase();

  const row = await db.getFirstAsync('SELECT * FROM goods WHERE barCode = ?', barCode);
  return row;
};