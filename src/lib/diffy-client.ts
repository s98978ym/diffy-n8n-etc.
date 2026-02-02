/**
 * Diffy 差分追跡クライアント
 * 業務プロセスの変更前後を記録し、差分を可視化する
 */

import type { DiffSnapshot } from "@/types";

/** 2つのオブジェクトの差分フィールドを検出 */
export function detectChanges(
  before: Record<string, unknown>,
  after: Record<string, unknown>
): string[] {
  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);
  const changed: string[] = [];
  for (const key of allKeys) {
    if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
      changed.push(key);
    }
  }
  return changed;
}

/** 差分スナップショットを生成 */
export function createDiffSnapshot(
  proposalId: string,
  before: Record<string, unknown>,
  after: Record<string, unknown>,
  description: string
): DiffSnapshot {
  return {
    id: crypto.randomUUID(),
    proposalId,
    before,
    after,
    changedFields: detectChanges(before, after),
    createdAt: new Date().toISOString(),
    description,
  };
}

/** 差分を人間が読みやすい形式に変換 */
export function formatDiffForDisplay(snapshot: DiffSnapshot): DiffLine[] {
  const lines: DiffLine[] = [];
  for (const field of snapshot.changedFields) {
    const oldVal = snapshot.before[field];
    const newVal = snapshot.after[field];
    if (oldVal === undefined) {
      lines.push({ field, type: "added", oldValue: null, newValue: newVal });
    } else if (newVal === undefined) {
      lines.push({ field, type: "removed", oldValue: oldVal, newValue: null });
    } else {
      lines.push({ field, type: "changed", oldValue: oldVal, newValue: newVal });
    }
  }
  return lines;
}

export interface DiffLine {
  field: string;
  type: "added" | "removed" | "changed";
  oldValue: unknown;
  newValue: unknown;
}

/**
 * 業務プロセスのスナップショットを比較するためのヘルパー
 * Diffy APIがある場合はそちらを使い、なければローカルで差分計算
 */
const DIFFY_BASE_URL = process.env.DIFFY_BASE_URL || "";

export async function compareViaApi(
  before: Record<string, unknown>,
  after: Record<string, unknown>
): Promise<DiffLine[]> {
  if (!DIFFY_BASE_URL) {
    // ローカルフォールバック
    const snapshot = createDiffSnapshot("temp", before, after, "API comparison");
    return formatDiffForDisplay(snapshot);
  }

  const res = await fetch(`${DIFFY_BASE_URL}/api/diff`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ before, after }),
  });
  if (!res.ok) throw new Error(`Diffy API error: ${res.status}`);
  return res.json();
}
