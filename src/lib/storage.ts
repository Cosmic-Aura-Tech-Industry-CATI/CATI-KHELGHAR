/**
 * Static LocalStorage manager for CATI KHELGHAR offline persistence.
 * Safe for SSR (guards against window === undefined).
 */

const STORAGE_PREFIX = 'catikhelghar_';

export interface StoredPlayerConfig {
  name: string;
  isBot: boolean;
}

export class StorageService {
  public static get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = window.localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  public static set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }

  public static remove(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (e) {
      console.warn('LocalStorage remove failed', e);
    }
  }

  public static isSoundEnabled(): boolean {
    return this.get<boolean>('sound_enabled', true);
  }

  public static setSoundEnabled(enabled: boolean): void {
    this.set('sound_enabled', enabled);
  }

  public static getPlayerConfigs(
    gameId: string,
    defaultConfigs: StoredPlayerConfig[]
  ): StoredPlayerConfig[] {
    const saved = this.get<StoredPlayerConfig[] | string[]>(`players_${gameId}`, []);
    if (!saved || saved.length === 0) return defaultConfigs;

    // Handle migration from string[] to StoredPlayerConfig[]
    if (typeof saved[0] === 'string') {
      return (saved as string[]).map((name, i) => ({
        name,
        isBot: i > 0 && name.toLowerCase().includes('bot')
      }));
    }

    return saved as StoredPlayerConfig[];
  }

  public static savePlayerConfigs(
    gameId: string,
    configs: StoredPlayerConfig[]
  ): void {
    this.set(`players_${gameId}`, configs);
  }

  public static getPlayerNames(gameId: string, count: number): string[] {
    const saved = this.get<string[]>(`players_${gameId}`, []);
    if (saved.length >= count) return saved.slice(0, count);
    return Array.from({ length: count }, (_, i) => `Player ${i + 1}`);
  }

  public static savePlayerNames(gameId: string, names: string[]): void {
    this.set(`players_${gameId}`, names);
  }

  public static recordMatch(gameId: string, winnerName: string): void {
    const history = this.get<{ date: string; winner: string }[]>(`history_${gameId}`, []);
    history.unshift({
      date: new Date().toISOString(),
      winner: winnerName
    });
    this.set(`history_${gameId}`, history.slice(0, 20));
  }

  public static resetAllData(): void {
    if (typeof window === 'undefined') return;
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => window.localStorage.removeItem(k));
    } catch (e) {
      console.warn('LocalStorage reset failed', e);
    }
  }
}
