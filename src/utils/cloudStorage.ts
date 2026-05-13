import { JSONBIN_API_KEY, JSONBIN_BIN_ID } from '../config/storage';
import type { CaptureRecord } from '../types';

export const useCloud = !!(JSONBIN_API_KEY && JSONBIN_BIN_ID);

const BIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;
const HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'X-Master-Key': JSONBIN_API_KEY,
  'X-Bin-Versioning': 'false',
};

function isValid(item: unknown): item is CaptureRecord {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'timestamp' in item &&
    'firstName' in item &&
    'items' in item
  );
}

async function readBin(): Promise<CaptureRecord[]> {
  try {
    const res = await fetch(`${BIN_URL}/latest`, {
      headers: { 'X-Master-Key': JSONBIN_API_KEY },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const raw = json.record;
    if (!Array.isArray(raw)) return [];
    return raw.filter(isValid);
  } catch {
    return [];
  }
}

async function writeBin(records: CaptureRecord[]): Promise<void> {
  try {
    await fetch(BIN_URL, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify(records),
    });
  } catch (e) {
    console.error('JSONBin write failed:', e);
  }
}

// ---- PUBLIC API ----

export async function saveCapture(record: CaptureRecord): Promise<void> {
  // Always save locally as immediate backup
  try {
    const local = JSON.parse(localStorage.getItem('belleluxe-captures') || '[]');
    if (Array.isArray(local)) {
      local.unshift(record);
      localStorage.setItem('belleluxe-captures', JSON.stringify(local));
    }
  } catch {
    localStorage.setItem('belleluxe-captures', JSON.stringify([record]));
  }

  // Then sync to JSONBin cloud
  if (useCloud) {
    const existing = await readBin();
    existing.unshift(record);
    await writeBin(existing);
  }
}

export async function fetchCaptures(): Promise<CaptureRecord[]> {
  // Prefer cloud if configured
  if (useCloud) {
    const records = await readBin();
    records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return records;
  }

  // localStorage fallback if JSONBin not configured
  try {
    const stored = localStorage.getItem('belleluxe-captures');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        const valid = parsed.filter(isValid);
        valid.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        return valid;
      }
    }
  } catch { /* ignore */ }
  return [];
}

export async function clearCaptures(): Promise<void> {
  localStorage.setItem('belleluxe-captures', '[]');
  if (useCloud) await writeBin([]);
}

export async function deleteCapture(id: string): Promise<void> {
  try {
    const local = JSON.parse(localStorage.getItem('belleluxe-captures') || '[]');
    if (Array.isArray(local)) {
      localStorage.setItem('belleluxe-captures', JSON.stringify(local.filter((r: CaptureRecord) => r.id !== id)));
    }
  } catch { /* ignore */ }

  if (useCloud) {
    const existing = await readBin();
    await writeBin(existing.filter(r => r.id !== id));
  }
}
