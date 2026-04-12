import { createTestDb } from './testDb';
import { runMigrations } from '../db/migrations';
import { PreferencesRepository } from './PreferencesRepository';

function setup() {
  const db = createTestDb();
  runMigrations(db);
  return new PreferencesRepository(db);
}

describe('PreferencesRepository', () => {
  it('gets the singleton preferences row', () => {
    const repo = setup();
    const prefs = repo.get();
    expect(prefs).not.toBeNull();
    expect(prefs!.id).toBe(1);
    expect(prefs!.haptics_enabled).toBe(1);
    expect(prefs!.sound_enabled).toBe(1);
    expect(prefs!.prompt_enabled).toBe(1);
    expect(prefs!.sync_enabled).toBe(0);
    expect(prefs!.onboarding_completed).toBe(0);
  });

  it('updates haptics_enabled', () => {
    const repo = setup();
    const updated = repo.update({ haptics_enabled: 0 });
    expect(updated.haptics_enabled).toBe(0);
    // others unchanged
    expect(updated.sound_enabled).toBe(1);
  });

  it('updates onboarding_completed', () => {
    const repo = setup();
    const updated = repo.update({ onboarding_completed: 1 });
    expect(updated.onboarding_completed).toBe(1);
  });

  it('updates multiple fields at once', () => {
    const repo = setup();
    const updated = repo.update({ sync_enabled: 1, prompt_enabled: 0 });
    expect(updated.sync_enabled).toBe(1);
    expect(updated.prompt_enabled).toBe(0);
  });

  it('persists changes across calls', () => {
    const repo = setup();
    repo.update({ haptics_enabled: 0 });
    const prefs = repo.get();
    expect(prefs!.haptics_enabled).toBe(0);
  });
});
