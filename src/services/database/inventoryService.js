import { getDBConnection } from './db';

export const clearInventory = async () => {
  const db = await getDBConnection();
  await db.runAsync("DELETE FROM inventory");
};

export const addInventoryGood = async (goodCode, quantity, type) => {
  const db = await getDBConnection();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO inventory (goodCode, quantity, type, scannedAt, updatedAt)
     VALUES (?, ?, ?, ?, ?)`,
    goodCode,
    quantity,
    type,
    now,
    now
  );
};

export const updateInventoryGoodQuantity = async (goodCode, newQuantity) => {
  const db = await getDBConnection();

  const now = new Date().toISOString();
  await db.runAsync(
    `UPDATE inventory SET quantity = ?, updatedAt = ? WHERE goodCode = ?`,
    newQuantity,
    now,
    goodCode
  );
};

export const getInventoryGood = async () => {
  const db = await getDBConnection();
  return await db.getAllAsync("SELECT * FROM inventory");
};

export const getInventoryGoodByGoodCode = async (goodCode) => {
  const db = await getDBConnection();
  return await db.getFirstAsync("SELECT * FROM inventory WHERE goodCode = ?", goodCode);
};

export const deleteInventoryGood = async (goodCode) => {
  const db = await getDBConnection();
  await db.runAsync("DELETE FROM inventory WHERE goodCode = ?", goodCode);
};

export const getAllInventoryItems = async () => {
  const db = await getDBConnection();
  const rows = await db.getAllAsync("SELECT * FROM inventory");
  return rows.map(row => ({
    goodCode: row.goodCode,
    quantity: row.quantity,
    type: row.type,
    scannedAt: row.scannedAt,
    updatedAt: row.updatedAt
  }));
};

