"use client";

import { useEffect, useState } from "react";
import { mockProposals, mockUsers } from "@/lib/mock-data";
import type { Proposal } from "@/types";

const statusLabels: Record<string, string> = {
  draft: "下書き", open: "募集中", in_review: "レビュー中",
  approved: "承認済", implemented: "実施済", rejected: "却下",
};

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  open: "bg-blue-100 text-blue-700",
  in_review: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  implemented: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<{ title: string; description: string; category: string; priority: "low" | "medium" | "high" | "critical"; tags: string }>({ title: "", description: "", category: "", priority: "medium", tags: "" });

  useEffect(() => {
    fetch("/api/proposals").then((r) => r.json()).then(setProposals).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        authorId: "u1",
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });
    if (res.ok) {
      const newP = await res.json();
      setProposals((prev) => [newP, ...prev]);
      setShowForm(false);
      setForm({ title: "", description: "", category: "", priority: "medium", tags: "" });
    }
  };

  const authorName = (id: string) => mockUsers.find((u) => u.id === id)?.name || id;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">改善提案</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
        >
          {showForm ? "キャンセル" : "+ 新しい提案"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
            <input
              required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="改善提案のタイトル"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">詳細</label>
            <textarea
              required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="現状の課題と改善案を記載してください"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
              <input
                value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="例: コミュニケーション"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">優先度</label>
              <select
                value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as "low" | "medium" | "high" | "critical" })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
                <option value="critical">緊急</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">タグ（カンマ区切り）</label>
              <input
                value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="例: 時短, 自動化"
              />
            </div>
          </div>
          <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
            提案を投稿
          </button>
        </form>
      )}

      <div className="space-y-3">
        {proposals.map((p) => (
          <a
            key={p.id}
            href={`/proposals/${p.id}`}
            className="block bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-primary-200 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-base mb-1">{p.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${statusColors[p.status]}`}>
                {statusLabels[p.status]}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
              <span>投稿者: {authorName(p.authorId)}</span>
              <span>{p.category}</span>
              <span>FB: {p.feedbacks.length}件</span>
              {p.tags.map((t) => (
                <span key={t} className="bg-gray-100 px-2 py-0.5 rounded">{t}</span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
