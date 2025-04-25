import { openDatabaseAsync } from "expo-sqlite";

let db;

const initDatabase = async () => {
  db = await openDatabaseAsync("scanner.db");

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS goods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    inMatrix INTEGER,
    isWeightGood INTEGER,
    unit TEXT,
    mask TEXT,
    boxBarCode TEXT,
    isProduction INTEGER,
    isExcise INTEGER,
    priceStatus INTEGER,
    reservationType INTEGER,
    providerName TEXT,
    barCode TEXT,
    goodCode TEXT,
    price REAL,
    stockCount REAL,
    blackMailCategory INTEGER,
    endSaleDate TEXT,
    excise TEXT
  );
  `);
};

export const initDB = async () => {
  if (!db) await initDatabase();
};

export const clearGoods = async () => {
  if (!db) await initDatabase();

  await db.runAsync("DELETE FROM goods");
};

export const insertGoods = async (goods) => {
  if (!db) await initDatabase();

  for (const item of goods) {
    await db.runAsync(
      `INSERT INTO goods (
        name, inMatrix, isWeightGood, unit, mask, boxBarCode, isProduction,
        isExcise, priceStatus, reservationType, providerName, barCode, goodCode,
        price, stockCount, blackMailCategory, endSaleDate, excise
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      item.name,
      item.inMatrix ? 1 : 0,
      item.isWeightGood ? 1 : 0,
      item.unit,
      item.mask,
      item.boxBarCode,
      item.isProduction ? 1 : 0,
      item.isExcise ? 1 : 0,
      item.priceStatus,
      item.reservationType ? 1 : 0,
      item.providerName,
      item.barCode,
      item.goodCode,
      item.price,
      item.stockCount,
      item.blackMailCategory,
      item.endSaleDate,
      item.excise
    );
    
  }
};

export const getAllGoods = async () => {
  if (!db) await initDatabase();

  const allRows = await db.getAllAsync("SELECT * FROM goods");
  return allRows;
};

export const getGoodById = async (goodId) => {
  if (!db) await initDatabase();

  const row = await db.getFirstAsync(
    "SELECT * FROM goods WHERE goodId = ?",
    goodId
  );
  return row;
};

export const deleteGoodById = async (goodId) => {
  if (!db) await initDatabase();

  await db.runAsync("DELETE FROM goods WHERE goodId = ?", goodId);
};

export const getGoodByBarcode = async (barCode) => {
  if (!db) await initDatabase();

  const row = await db.getFirstAsync(
    "SELECT * FROM goods WHERE barCode = ?",
    barCode
  );
  return row;
};

export const getNameGoodByGoodCode = async (goodCode) => {
  if (!db) await initDatabase();

  const row = await db.getFirstAsync(
    "SELECT * FROM goods WHERE goodCode = ?",
    goodCode
  );
  return row.name;
};

