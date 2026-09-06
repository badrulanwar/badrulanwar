import { Student, Teacher, ColumnsBySem } from '../types';

export interface CloudDatabasePayload {
  students: Student[];
  teacherColumns: Record<string, Record<string, { '1': ColumnsBySem; '2': ColumnsBySem }>>;
  teachers: Teacher[];
  timestamp?: number;
}

/**
 * Fetch the latest synchronized data from the server.
 */
export async function fetchCloudData(): Promise<{
  success: boolean;
  data: CloudDatabasePayload | null;
  timestamp: number;
}> {
  try {
    const res = await fetch('/api/data', {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const json = await res.json();
    return {
      success: true,
      data: json.data || null,
      timestamp: json.timestamp || 0
    };
  } catch (err) {
    console.warn('Gagal memuat data dari server cloud (akan menggunakan penyimpanan lokal):', err);
    return {
      success: false,
      data: null,
      timestamp: 0
    };
  }
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null;
let latestPendingPayload: CloudDatabasePayload | null = null;

/**
 * Automatically persist and broadcast data to the server with intelligent debouncing.
 */
export function saveCloudDataDebounced(
  payload: CloudDatabasePayload,
  onSaved?: (timestamp: number) => void
) {
  latestPendingPayload = payload;

  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(async () => {
    if (!latestPendingPayload) return;
    const toSend = latestPendingPayload;
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(toSend)
      });
      if (res.ok) {
        const json = await res.json();
        if (onSaved && json.timestamp) {
          onSaved(json.timestamp);
        }
      }
    } catch (err) {
      console.warn('Gagal sinkronisasi data ke cloud server:', err);
    }
  }, 400); // 400ms debounce for silky smooth keystroke performance
}

/**
 * Subscribe to real-time multi-device changes via Server-Sent Events (SSE)
 * with automatic polling fallback.
 */
export function subscribeToCloudUpdates(onUpdate: (timestamp: number) => void): () => void {
  let eventSource: EventSource | null = null;
  let pollInterval: ReturnType<typeof setInterval> | null = null;
  let isClosed = false;

  const startPolling = () => {
    if (pollInterval || isClosed) return;
    pollInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/sync/check');
        if (res.ok) {
          const json = await res.json();
          if (json.exists && json.mtimeMs) {
            onUpdate(json.mtimeMs);
          }
        }
      } catch (e) {
        // silent catch
      }
    }, 5000);
  };

  try {
    if (typeof EventSource !== 'undefined') {
      eventSource = new EventSource('/api/sync/events');

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'DATABASE_UPDATED' && data.timestamp) {
            onUpdate(data.timestamp);
          }
        } catch (e) {
          // ignore parsing error
        }
      };

      eventSource.onerror = () => {
        // If SSE fails (e.g. proxy issue), switch to polling
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        startPolling();
      };
    } else {
      startPolling();
    }
  } catch (err) {
    startPolling();
  }

  return () => {
    isClosed = true;
    if (eventSource) {
      eventSource.close();
    }
    if (pollInterval) {
      clearInterval(pollInterval);
    }
  };
}
