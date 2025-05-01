import { getDBConnection } from './db';

export const clearInventory = async () => {
  const db = await getDBConnection();
  await db.runAsync("DELETE FROM inventory");
};

export const addOrUpdateInventoryGood = async (goodCode, quantity, type) => {
  const db = await getDBConnection();

  const existing = await db.getFirstAsync(
    "SELECT * FROM inventory WHERE goodCode = ?", goodCode
  );

  if (existing) {
    await db.runAsync(
      "UPDATE inventory SET quantity = ? WHERE goodCode = ?",
      quantity,
      goodCode
    );
  } else {
    await db.runAsync(
      `INSERT INTO inventory (goodCode, quantity, type)
       VALUES (?, ?, ?)`,
      goodCode,
      quantity,
      type
    );
  }
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
