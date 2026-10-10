'use client';

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  SystemNotification,
  SystemNotificationsConfig,
  defaultSystemNotificationsConfig,
} from './types';

interface SystemNotificationsContextType {
  notifications: SystemNotification[];
  dismissedIds: string[];
  addNotification: (notification: SystemNotification) => void;
  removeNotification: (id: string) => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
  clearDismissed: () => void;
  getActiveNotifications: (
    layout?: 'main' | 'guest' | 'auth',
  ) => SystemNotification[];
}

const SystemNotificationsContext = createContext<
  SystemNotificationsContextType | undefined
>(undefined);

interface SystemNotificationsProviderProps {
  children: ReactNode;
  storageKey?: string;
  initialNotifications?: SystemNotification[];
  announcementsUrl?: string;
}

// Storage utilities
const SystemNotificationsStorage = {
  load: (
    key: string,
    defaultValue: SystemNotificationsConfig,
  ): SystemNotificationsConfig => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...defaultValue,
          ...parsed,
        };
      }
    } catch (error) {
      console.error('Failed to load system notifications config:', error);
    }
    return defaultValue;
  },
  save: (key: string, config: SystemNotificationsConfig) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save system notifications config:', error);
    }
  },
  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove system notifications config:', error);
    }
  },
};

export function SystemNotificationsProvider({
  children,
  storageKey = 'system-notifications',
  initialNotifications = [],
  announcementsUrl = '/system-announcements.json',
}: SystemNotificationsProviderProps) {
  const [config, setConfig] = useState<SystemNotificationsConfig>(() => {
    const loaded = SystemNotificationsStorage.load(
      storageKey,
      defaultSystemNotificationsConfig,
    );
    return {
      ...loaded,
      notifications:
        initialNotifications.length > 0
          ? initialNotifications
          : loaded.notifications,
    };
  });

  // Ref to track latest dismissedIds for async retry logic (avoids stale closure)
  const dismissedIdsRef = useRef(config.dismissedIds);
  // eslint-disable-next-line -- updating ref during render is intentional to sync with state
  dismissedIdsRef.current = config.dismissedIds;

  // Fetch announcements from JSON file on mount
  useEffect(() => {
    if (!announcementsUrl) return;

    let active = true;
    const retryAttemptedRef = { current: false };

    const loadAnnouncements = async () => {
      try {
        if (!active) return;

        const response = await fetch(announcementsUrl);
        if (!active) return;

        if (!response.ok) {
          console.warn(`Failed to fetch announcements: ${response.status}`);
          return;
        }
        const announcements: SystemNotification[] = await response.json();
        if (!active) return;

        if (!Array.isArray(announcements) || announcements.length === 0) {
          return;
        }

        const latest = announcements[0];
        const uniqueIds = [...new Set(announcements.map((a) => a.id))];

        // If announcements are present but every loaded ID is already dismissed,
        // clear old dismissals and retry ONCE so genuinely new announcements surface.
        // Use dismissedIdsRef to read CURRENT dismissed IDs (not stale closure)
        if (
          uniqueIds.length > 0 &&
          uniqueIds.every((id) => dismissedIdsRef.current.includes(id))
        ) {
          if (retryAttemptedRef.current) {
            // Already retried once, don't loop
            return;
          }
          retryAttemptedRef.current = true;
          setConfig((prev) => ({ ...prev, dismissedIds: [] }));
          // Wait for state to update, then retry
          await new Promise((resolve) => setTimeout(resolve, 50));
          if (!active) return;
          return loadAnnouncements();
        }

        if (active) {
          setConfig((prev) => ({
            ...prev,
            notifications: [latest],
          }));
        }
      } catch (error) {
        if (active) {
          console.warn('Failed to fetch system announcements:', error);
        }
      }
    };

    loadAnnouncements();

    return () => {
      active = false;
    };
  }, [announcementsUrl]);

  // Save dismissed IDs to localStorage whenever they change
  useEffect(() => {
    SystemNotificationsStorage.save(storageKey, {
      notifications: [], // Don't persist notifications, only dismissed IDs
      dismissedIds: config.dismissedIds,
    });
  }, [config.dismissedIds, storageKey]);

  const addNotification = (notification: SystemNotification) => {
    setConfig((prev) => ({
      ...prev,
      notifications: [
        ...prev.notifications.filter((n) => n.id !== notification.id),
        notification,
      ],
    }));
  };

  const removeNotification = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      notifications: prev.notifications.filter((n) => n.id !== id),
    }));
  };

  const dismissNotification = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      dismissedIds: [...new Set([...prev.dismissedIds, id])],
    }));
  };

  const clearAllNotifications = () => {
    setConfig((prev) => ({
      ...prev,
      notifications: [],
    }));
  };

  const clearDismissed = () => {
    setConfig((prev) => ({
      ...prev,
      dismissedIds: [],
    }));
    SystemNotificationsStorage.remove(storageKey);
  };

  const getActiveNotifications = (layout?: 'main' | 'guest' | 'auth') => {
    return config.notifications.filter((notification) => {
      // Filter out dismissed notifications
      if (config.dismissedIds.includes(notification.id)) {
        return false;
      }
      // Filter by layout if specified
      if (layout && notification.showOn && notification.showOn.length > 0) {
        return notification.showOn.includes(layout);
      }
      return true;
    });
  };

  return (
    <SystemNotificationsContext.Provider
      value={{
        notifications: config.notifications,
        dismissedIds: config.dismissedIds,
        addNotification,
        removeNotification,
        dismissNotification,
        clearAllNotifications,
        clearDismissed,
        getActiveNotifications,
      }}
    >
      {children}
    </SystemNotificationsContext.Provider>
  );
}

export function useSystemNotifications() {
  const context = useContext(SystemNotificationsContext);
  if (!context) {
    throw new Error(
      'useSystemNotifications must be used within a SystemNotificationsProvider',
    );
  }
  return context;
}
