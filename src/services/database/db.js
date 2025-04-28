import { openDatabaseAsync } from "expo-sqlite";

let db;

const getDBConnection = async () => {
  if (!db) {
    db = await openDatabaseAsync("scanner.db");
  }
  return db;
};

export default getDBConnection;
