import * as SQLite from 'expo-sqlite';
import { runMigrations } from '@myhappyjar/core';
import { createExpoSqliteClient } from './ExpoSqliteClient';
import type { DatabaseClient } from '@myhappyjar/core';

export async function openAndMigrate(): Promise<DatabaseClient> {
  const db = SQLite.openDatabaseSync('myhappyjar.db');
  const client = createExpoSqliteClient(db);
  runMigrations(client);
  return client;
}
