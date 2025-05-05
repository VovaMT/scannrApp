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
          excise TEXT,
          description TEXT
        );

        CREATE TABLE IF NOT EXISTS goods_operations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          goodCode TEXT NOT NULL,
          quantity REAL NOT NULL,
          type INTEGER NOT NULL,
          scannedAt TEXT,
          updatedAt TEXT
        );
      `);
    },
  }
];
