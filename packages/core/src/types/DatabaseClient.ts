export interface DatabaseClient {
  execute<T = unknown>(sql: string, args?: unknown[]): { rows: T[] };
  run(sql: string, args?: unknown[]): { changes: number; lastInsertRowid: number | bigint };
}
