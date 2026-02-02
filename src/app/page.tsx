"use client";

import { useEffect, useState } from "react";
import { mockStats, mockProposals } from "@/lib/mock-data";
import type { DashboardStats, Proposal } from "@/types";

const statusLabels: Record<string, string> = {
  draft: "下書き",
  open: "募集中",
  in_review: "レビュー中",
  approved: "承認済",
  implemented: "実施済",
  rejected: "却下",
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);

  useEffect(() => {
    fetch("/api/proposals")
      .then((r) => r.json())
      .then(setProposals)
      .catch(() => {});
  }, []);

  const cards = [
    { label: "提案総数", value: stats.totalProposals, color: "text-primary-600" },
    { label: "進行中", value: stats.activeProposals, color: "text-orange-600" },
    { label: "実施済", value: stats.implementedCount, color: "text-accent-600" },
    { label: "フィードバック数", value: stats.feedbackCount, color: "text-purple-600" },
    { label: "稼働ワークフロー", value: stats.activeWorkflows, color: "text-indigo-600" },
    { label: "改善達成率", value: `${stats.improvementRate}%`, color: "text-green-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>

      {/* 統計カード */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">{c.label}</div>
            <div className={`text-2xl font-bold ${c.color}`}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* 最近の提案 */}
      <h2 className="text-lg font-semibold mb-3">最近の改善提案</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-4 py-3 font-medium">タイトル</th>
              <th className="text-left px-4 py-3 font-medium">カテゴリ</th>
              <th className="text-left px-4 py-3 font-medium">優先度</th>
              <th className="text-left px-4 py-3 font-medium">ステータス</th>
              <th className="text-left px-4 py-3 font-medium">FB数</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((p) => (
              <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-3 font-medium">
                  <a href={`/proposals/${p.id}`} className="text-primary-600 hover:underline">
                    {p.title}
                  </a>
                </td>
                <td className="px-4 py-3 text-gray-600">{p.category}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[p.priority]}`}>
                    {p.priority}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{statusLabels[p.status] || p.status}</td>
                <td className="px-4 py-3 text-gray-600">{p.feedbacks.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
