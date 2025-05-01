import * as SQLite from "expo-sqlite";
import { migrations } from "./migrations";

let dbInstance = null;

export const initDatabase = async () => {
  console.log("Ініціалізую базу...");

  try {
    const db = await SQLite.openDatabaseAsync("scanner.db");
    await db.execAsync(`PRAGMA foreign_keys = ON;`);
    return db;
  } catch (error) {
    console.log("Помилка ініціалізації БД:", error);
    return null;
  }
};

export const getDBConnection = async () => {
  console.log("Отримання підключення...");
  if (!dbInstance) {
    dbInstance = await initDatabase();
    if (!dbInstance) throw new Error("Не вдалося ініціалізувати базу даних");

    await runMigrations(); // викликається лише при першому підключенні до БД
  }

  return dbInstance;
};

const getDBVersion = async (db) => {
  try {
    const result = await db.getFirstAsync("PRAGMA user_version;");
    return result?.user_version || 0;
  } catch (error) {
    console.error("Помилка отримання версії БД:", error);
    return 0;
  }
};

export const setDBVersion = async (db, version) => {
  try {
    await db.execAsync(`PRAGMA user_version = ${version};`);
    console.log(`Базу даних оновлено до версії ${version}`);
  } catch (error) {
    console.error("Помилка оновлення версії БД:", error);
  }
};

export const runMigrations = async () => {
  console.log("Перевірка міграції...");
  try {
    if (!dbInstance) throw new Error("Базу даних не ініціалізовано");

    const currentVersion = await getDBVersion(dbInstance);


    for (const migration of migrations) {
      if (migration.version > currentVersion) {
        console.log(`Застосовуємо міграцію: ${migration.version}`);
        try {
          await migration.up(dbInstance);
          await setDBVersion(dbInstance, migration.version);
        } catch (error) {
          console.error(`Міграція ${migration.version} не вдалася!`, error);
          break;
        }
      }
    }
  } catch (error) {
    console.error("Помилка міграцій:", error);
  }
};
