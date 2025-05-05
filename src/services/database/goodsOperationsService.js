import { getDBConnection } from './db';
import dayjs from 'dayjs';

// Очистити всі записи певного типу
export const clearGoodsOperationsByType = async (type) => {
  const db = await getDBConnection();
  await db.runAsync("DELETE FROM goods_operations WHERE type = ?", type);
};

// Додати товар з конкретним типом
export const addGoodsOperation = async (goodCode, quantity, type) => {
  const db = await getDBConnection();
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

  await db.runAsync(
    `INSERT INTO goods_operations (goodCode, quantity, type, scannedAt, updatedAt)
     VALUES (?, ?, ?, ?, ?)`,
    goodCode,
    quantity,
    type,
    now,
    now
  );
};

// Оновити кількість для певного товару і типу
export const updateGoodsOperationQuantity = async (goodCode, newQuantity, type) => {
  const db = await getDBConnection();
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

  await db.runAsync(
    `UPDATE goods_operations SET quantity = ?, updatedAt = ? WHERE goodCode = ? AND type = ?`,
    newQuantity,
    now,
    goodCode,
    type
  );
};

// Отримати всі записи певного типу
export const getGoodsOperationsByType = async (type) => {
  const db = await getDBConnection();
  return await db.getAllAsync("SELECT * FROM goods_operations WHERE type = ?", type);
};

// Отримати один товар по goodCode і типу
export const getGoodsOperationByCodeAndType = async (goodCode, type) => {
  const db = await getDBConnection();
  return await db.getFirstAsync("SELECT * FROM goods_operations WHERE goodCode = ? AND type = ?", goodCode, type);
};

// Видалити товар з певним goodCode і типом
export const deleteGoodsOperation = async (goodCode, type) => {
  const db = await getDBConnection();
  await db.runAsync("DELETE FROM goods_operations WHERE goodCode = ? AND type = ?", goodCode, type);
};

// Отримати всі записи з певанним типом
export const getAllGoodsOperationsByType = async (type) => {
  const db = await getDBConnection();
  const rows = await db.getAllAsync("SELECT * FROM goods_operations WHERE type = ?", type);
  return rows.map(row => ({
    goodCode: row.goodCode,
    quantity: row.quantity,
    type: row.type,
    scannedAt: row.scannedAt,
    updatedAt: row.updatedAt
  }));
};
