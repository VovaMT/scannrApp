export const migrations = [
    {
        version: 1,
        up: async (db) => {
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
  
          CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            goodCode TEXT NOT NULL,
            quantity REAL NOT NULL,
            type INTEGER NOT NULL
          );
        `);
        },
    },
    {
      version: 2,
      up: async (db) => {
        await db.execAsync(`ALTER TABLE goods ADD COLUMN description TEXT;`);
      },
    },

    {
      version: 3,
      up: async (db) => {
        await db.execAsync(`
          CREATE TABLE goods_new (
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
  
          INSERT INTO goods_new
          SELECT 
            id, name, inMatrix, isWeightGood, unit, mask, boxBarCode, isProduction,
            isExcise, priceStatus, reservationType, providerName, barCode, goodCode,
            price, stockCount, blackMailCategory, endSaleDate, excise
          FROM goods;
  
          DROP TABLE goods;
          ALTER TABLE goods_new RENAME TO goods;
        `);
      },
    },
];





