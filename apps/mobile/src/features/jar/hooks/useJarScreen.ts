import { useState, useEffect, useCallback } from 'react';
import { JarRepository, NoteRepository, toDateKey } from '@myhappyjar/core';
import type { Jar, Note } from '@myhappyjar/core';
import { useDb } from '../../../providers/DbProvider';

export interface JarScreenState {
  jar: Jar | null;
  notes: Note[];
  todayNote: Note | null;
  isLoading: boolean;
  refresh: () => void;
}

export function useJarScreen(): JarScreenState {
  const db = useDb();
  const [jar, setJar] = useState<Jar | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [todayNote, setTodayNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(() => {
    const jarRepo = new JarRepository(db);
    const noteRepo = new NoteRepository(db);
    const year = new Date().getFullYear();
    const todayKey = toDateKey(new Date());

    // Get or create jar for current year
    let currentJar = jarRepo.getCurrentYear(year);
    if (!currentJar) {
      currentJar = jarRepo.create({ year, name: null });
    }

    const jarNotes = noteRepo.listByJar(currentJar.id);
    const today = noteRepo.getByDateKey(todayKey);

    setJar(currentJar);
    setNotes(jarNotes);
    setTodayNote(today);
    setIsLoading(false);
  }, [db]);

  useEffect(() => {
    load();
  }, [load]);

  return { jar, notes, todayNote, isLoading, refresh: load };
}
