
"use client";

import {
  Cloud,
  CloudOff,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { isDemoMode } from "@/lib/demo-mode";
import { useOfflineSync } from "@/lib/hooks/useOfflineSync";

export default function SyncStatus() {
  const {
    isOnline,
    isSyncing,
    pendingCount,
    syncError,
    sync,
  } = useOfflineSync();

  // Demo Mode uses localStorage instead of Supabase sync.
  if (isDemoMode) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
        <CheckCircle2 size={16} />
        <span>Demo Mode · Local Storage</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Cloud size={16} className="text-green-600" />
          ) : (
            <CloudOff size={16} className="text-orange-500" />
          )}

          <span>
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>

        <span className="text-gray-300 dark:text-gray-700">
          |
        </span>

        <span>
          {pendingCount} pending
        </span>

        {isSyncing ? (
          <span className="flex items-center gap-1 text-blue-600">
            <RefreshCw size={14} className="animate-spin" />
            Syncing...
          </span>
        ) : (
          <button
            type="button"
            onClick={() => void sync()}
            disabled={!isOnline || pendingCount === 0}
            className="ml-auto flex items-center gap-1 rounded-md px-2 py-1 text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-blue-950"
          >
            <RefreshCw size={14} />
            Retry Sync
          </button>
        )}
      </div>

      {syncError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p>{syncError}</p>
        </div>
      )}
    </div>
  );
}
