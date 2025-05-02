import { getDBConnection } from './db';

export const clearGoods = async () => {
  const db = await getDBConnection();
  await db.runAsync("DELETE FROM goods");
};

export const insertGoods = async (goods) => {
  const db = await getDBConnection();

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
  const db = await getDBConnection();
  return await db.getAllAsync("SELECT * FROM goods");
};

export const getGoodByBarcode = async (barCode) => {
  const db = await getDBConnection();
  return await db.getFirstAsync("SELECT * FROM goods WHERE barCode = ?", barCode);
};

export const getGoodByGoodcode = async (goodCode) => {
  const db = await getDBConnection();
  return await db.getFirstAsync("SELECT * FROM goods WHERE goodCode = ?", goodCode);
};

export const getNameGoodByGoodCode = async (goodCode) => {
  const good = await getGoodByGoodcode(goodCode);
  return good ? good.name : null;
};

export const findGoodByMaskPrefix = async (code) => {
  const db = await getDBConnection();
  const pattern = `${code}#%`;
  return await db.getFirstAsync("SELECT * FROM goods WHERE mask LIKE ?", pattern);
};
