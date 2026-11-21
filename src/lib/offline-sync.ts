
const SYNC_QUEUE_KEY = "careerbridge-sync-queue";

export const SYNC_QUEUE_EVENT = "careerbridge-sync-queue-change";

export type SyncOperationType =
  | "UPDATE_PROFILE"
  | "CREATE_JOB"
  | "UPDATE_JOB"
  | "DELETE_JOB"
  | "CREATE_APPLICATION"
  | "UPDATE_APPLICATION"
  | "SAVE_JOB"
  | "UNSAVE_JOB";

export interface SyncOperation {
  id: string;
  userId: string;
  type: SyncOperationType;
  payload: Record<string, unknown>;
  createdAt: string;
  attempts: number;
  lastError?: string;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getSyncQueue(): SyncOperation[] {
  if (!isBrowser()) return [];

  try {
    const stored = localStorage.getItem(SYNC_QUEUE_KEY);

    return stored
      ? (JSON.parse(stored) as SyncOperation[])
      : [];
  } catch {
    return [];
  }
}

function saveSyncQueue(queue: SyncOperation[]): void {
  if (!isBrowser()) return;

  localStorage.setItem(
    SYNC_QUEUE_KEY,
    JSON.stringify(queue)
  );

  window.dispatchEvent(
    new Event(SYNC_QUEUE_EVENT)
  );
}

export function getPendingSyncCount(userId?: string): number {
  const queue = getSyncQueue();

  if (!userId) {
    return queue.length;
  }

  return queue.filter(
    (operation) => operation.userId === userId
  ).length;
}


export function addToSyncQueue(
  operation: Omit<
    SyncOperation,
    "id" | "createdAt" | "attempts"
  >
): SyncOperation {
  const queue = getSyncQueue();

  // Merge pending profile updates for the same user.
  if (operation.type === "UPDATE_PROFILE") {
    const existingOperation = [...queue]
      .reverse()
      .find(
        (item) =>
          item.userId === operation.userId &&
          item.type === "UPDATE_PROFILE"
      );

    if (existingOperation) {
      const updatedOperation: SyncOperation = {
        ...existingOperation,
        payload: {
          ...existingOperation.payload,
          ...operation.payload,
        },
        lastError: undefined,
      };

      const updatedQueue = queue.map((item) =>
        item.id === existingOperation.id
          ? updatedOperation
          : item
      );

      saveSyncQueue(updatedQueue);

      return updatedOperation;
    }
  }

  const newOperation: SyncOperation = {
    ...operation,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    attempts: 0,
  };

  saveSyncQueue([...queue, newOperation]);

  return newOperation;
}


export function removeFromSyncQueue(
  operationId: string
): void {
  const updatedQueue = getSyncQueue().filter(
    (operation) => operation.id !== operationId
  );

  saveSyncQueue(updatedQueue);
}

export function updateSyncOperation(
  operationId: string,
  errorMessage: string
): void {
  const updatedQueue = getSyncQueue().map((operation) =>
    operation.id === operationId
      ? {
        ...operation,
        attempts: operation.attempts + 1,
        lastError: errorMessage,
      }
      : operation
  );

  saveSyncQueue(updatedQueue);
}

export function clearUserSyncQueue(userId: string): void {
  const updatedQueue = getSyncQueue().filter(
    (operation) => operation.userId !== userId
  );

  saveSyncQueue(updatedQueue);
}
