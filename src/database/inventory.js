import { openDatabaseAsync } from "expo-sqlite";

let db;

const initInventoryDB = async () => {
    db = await openDatabaseAsync("scanner.db");

    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goodCode TEXT NOT NULL,
      quantity REAL NOT NULL,
      type INTEGER NOT NULL
    );
  `);
};

export const initInventory = async () => {
    if (!db) await initInventoryDB();
};

export const addOrUpdateInventoryItem = async (goodCode, quantity, type) => {
    if (!db) await initInventoryDB();

    const existing = await db.getFirstAsync(
        "SELECT * FROM inventory WHERE goodCode = ? ",
        goodCode
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

export const getInventoryItems = async () => {
    if (!db) await initInventoryDB();

    return await db.getAllAsync("SELECT * FROM inventory");
};

export const deleteInventoryItem = async (goodCode, type) => {
    if (!db) await initInventoryDB();

    await db.runAsync("DELETE FROM inventory WHERE goodCode = ? AND type = ?", goodCode, type);
};

export const clearInventory = async () => {
    if (!db) await initInventoryDB();

    await db.runAsync("DELETE FROM inventory");
};

export const getInventoryGoodByGoodCode = async (goodCode) => {
    if (!db) await initInventoryDB();

    const row = await db.getFirstAsync(
        "SELECT * FROM inventory WHERE goodCode = ?", goodCode);
 
        return row;
    
};


