"use client";

import { useState } from "react";
import type { DiffLine } from "@/lib/diffy-client";

export default function DiffPage() {
  const [before, setBefore] = useState('{\n  "朝礼時間": "15分",\n  "共有方法": "口頭のみ",\n  "参加人数": 20\n}');
  const [after, setAfter] = useState('{\n  "朝礼時間": "5分",\n  "共有方法": "チャット併用",\n  "参加人数": 20,\n  "チャットツール": "Slack"\n}');
  const [result, setResult] = useState<DiffLine[] | null>(null);
  const [error, setError] = useState("");

  const runDiff = async () => {
    setError("");
    try {
      const beforeObj = JSON.parse(before);
      const afterObj = JSON.parse(after);
      const res = await fetch("/api/diff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId: "demo", before: beforeObj, after: afterObj, description: "手動比較" }),
      });
      const data = await res.json();
      setResult(data.display);
    } catch (e) {
      setError("JSONの形式が正しくありません");
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">変更履歴 (Diffy)</h1>
      <p className="text-sm text-gray-500 mb-6">
        業務プロセスの「変更前」と「変更後」をJSON形式で入力し、差分を可視化します。
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">変更前 (Before)</label>
          <textarea
            value={before} onChange={(e) => setBefore(e.target.value)}
            rows={8}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">変更後 (After)</label>
          <textarea
            value={after} onChange={(e) => setAfter(e.target.value)}
            rows={8}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button onClick={runDiff} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium mb-6">
        差分を比較
      </button>

      {result && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold mb-3">差分結果</h2>
          <div className="space-y-2">
            {result.map((line, i) => (
              <div
                key={i}
                className={`px-4 py-2 rounded-lg text-sm font-mono ${
                  line.type === "added" ? "bg-green-50 border border-green-200" :
                  line.type === "removed" ? "bg-red-50 border border-red-200" :
                  "bg-yellow-50 border border-yellow-200"
                }`}
              >
                <span className="font-semibold">{line.field}:</span>{" "}
                {line.type === "added" && <span className="text-green-700">+ {JSON.stringify(line.newValue)}</span>}
                {line.type === "removed" && <span className="text-red-700">- {JSON.stringify(line.oldValue)}</span>}
                {line.type === "changed" && (
                  <>
                    <span className="text-red-600 line-through">{JSON.stringify(line.oldValue)}</span>
                    {" → "}
                    <span className="text-green-700">{JSON.stringify(line.newValue)}</span>
                  </>
                )}
              </div>
            ))}
            {result.length === 0 && <p className="text-gray-500 text-sm">変更はありません</p>}
          </div>
        </div>
      )}
    </div>
  );
}
