import getDBConnection from './db';

const initGoodsTable = async () => {
  const db = await getDBConnection();
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

export const clearGoods = async () => {
  const db = await getDBConnection();
  await initGoodsTable();
  await db.runAsync("DELETE FROM goods");
};

export const insertGoods = async (goods) => {
  const db = await getDBConnection();
  await initGoodsTable();

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
  await initGoodsTable();
  return await db.getAllAsync("SELECT * FROM goods");
};

export const getGoodByBarcode = async (barCode) => {
  const db = await getDBConnection();
  await initGoodsTable();
  return await db.getFirstAsync("SELECT * FROM goods WHERE barCode = ?", barCode);
};

export const getGoodByGoodcode = async (goodCode) => {
  const db = await getDBConnection();
  await initGoodsTable();
  return await db.getFirstAsync("SELECT * FROM goods WHERE goodCode = ?", goodCode);
};

export const getNameGoodByGoodCode = async (goodCode) => {
  const db = await getDBConnection();
  await initGoodsTable();
  const good = await getGoodByGoodcode(goodCode);
  return good ? good.name : null;
};

export const deleteGoodById = async (goodId) => {
  const db = await getDBConnection();
  await initGoodsTable();
  await db.runAsync("DELETE FROM goods WHERE id = ?", goodId);
};

export const findGoodByMaskPrefix = async (code) => {
  const db = await getDBConnection();
  await initGoodsTable();

  const pattern = `${code}#%`; 
  const result = await db.getFirstAsync(
    "SELECT * FROM goods WHERE mask LIKE ?",
    pattern
  );

  return result;
};

