import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import type { DatabaseClient } from '@myhappyjar/core';
import { openAndMigrate } from '../db/client';

interface DbContextValue {
  db: DatabaseClient;
}

const DbContext = createContext<DbContextValue | null>(null);

export function useDb(): DatabaseClient {
  const ctx = useContext(DbContext);
  if (!ctx) {
    throw new Error('useDb must be used within DbProvider');
  }
  return ctx.db;
}

interface DbProviderProps {
  children: React.ReactNode;
}

export function DbProvider({ children }: DbProviderProps) {
  const [db, setDb] = useState<DatabaseClient | null>(null);

  console.log('[DbProvider]', db ? 'ready' : 'loading');

  useEffect(() => {
    openAndMigrate().then(setDb).catch(console.error);
  }, []);

  if (!db) {
    // Brief loading state — empty linen screen, no spinner per spec
    return <View style={styles.loading} />;
  }

  return (
    <DbContext.Provider value={{ db }}>
      {children}
    </DbContext.Provider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#F5F0E8',
  },
});
