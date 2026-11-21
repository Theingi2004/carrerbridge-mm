
"use client";

import { useCallback, useEffect, useState } from "react";

import { isDemoMode } from "@/lib/demo-mode";
import { createClient } from "@/lib/supabase/client";
import { syncPendingChanges } from "@/lib/sync-engine";

import {
  getPendingSyncCount,
  SYNC_QUEUE_EVENT,
} from "@/lib/offline-sync";

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncError, setSyncError] = useState<string | null>(null);

  const updatePendingCount = useCallback(
    (userId?: string) => {
      setPendingCount(
        userId ? getPendingSyncCount(userId) : 0
      );
    },
    []
  );

  const sync = useCallback(async () => {
    if (isDemoMode || !navigator.onLine) return;

    setSyncError(null);
    setIsSyncing(true);

    try {
      const supabase = createClient();

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      if (!session?.user) {
        setPendingCount(0);
        return;
      }

      const userId = session.user.id;

      await syncPendingChanges(userId);

      updatePendingCount(userId);

      // Check whether failed operations remain.
      const remaining = getPendingSyncCount(userId);

      if (remaining > 0) {
        setSyncError(
          `${remaining} change(s) still need synchronization.`
        );
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Synchronization failed.";

      setSyncError(message);
    } finally {
      setIsSyncing(false);
    }
  }, [updatePendingCount]);

  useEffect(() => {
    if (isDemoMode) return;

    const supabase = createClient();

    let currentUserId: string | undefined;

    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      currentUserId = session?.user.id;

      updatePendingCount(currentUserId);
    };

    void loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        currentUserId = session?.user.id;
        updatePendingCount(currentUserId);
      }
    );

    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    const handleOnline = () => {
      setIsOnline(true);
      void sync();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    const handleQueueChange = () => {
      updatePendingCount(currentUserId);
    };

    updateOnlineStatus();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener(
      SYNC_QUEUE_EVENT,
      handleQueueChange
    );

    void sync();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener(
        SYNC_QUEUE_EVENT,
        handleQueueChange
      );

      subscription.unsubscribe();
    };
  }, [sync, updatePendingCount]);

  return {
    isOnline,
    isSyncing,
    pendingCount,
    syncError,
    sync,
  };
}
