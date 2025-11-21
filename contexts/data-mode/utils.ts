import { DataModeConfig, defaultDataModeConfig } from './types';

/**
 * DataModeStorage - Utilities for persisting data mode configuration
 */
export const DataModeStorage = {
  /**
   * Load configuration from localStorage
   */
  load(key: string, fallback: DataModeConfig): DataModeConfig {
    if (typeof window === 'undefined') return fallback;

    try {
      const stored = localStorage.getItem(key);
      if (!stored) return fallback;

      const parsed = JSON.parse(stored);
      return { ...fallback, ...parsed };
    } catch (error) {
      console.error('Failed to load data mode config:', error);
      return fallback;
    }
  },

  /**
   * Save configuration to localStorage
   */
  save(key: string, config: DataModeConfig): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(key, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save data mode config:', error);
    }
  },

  /**
   * Remove configuration from localStorage
   */
  remove(key: string): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove data mode config:', error);
    }
  },
};
