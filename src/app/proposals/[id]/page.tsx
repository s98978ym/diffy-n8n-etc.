"use client";

import { useEffect, useState } from "react";
import { mockProposals, mockUsers } from "@/lib/mock-data";
import type { Proposal, Feedback } from "@/types";

const statusLabels: Record<string, string> = {
  draft: "下書き", open: "募集中", in_review: "レビュー中",
  approved: "承認済", implemented: "実施済", rejected: "却下",
};

const sentimentIcons: Record<string, string> = {
  positive: "👍", neutral: "💬", negative: "⚠️",
};

export default function ProposalDetailPage({ params }: { params: { id: string } }) {
  const [proposal, setProposal] = useState<Proposal | null>(
    mockProposals.find((p) => p.id === params.id) || null
  );
  const [fbForm, setFbForm] = useState({ content: "", sentiment: "neutral" as Feedback["sentiment"] });

  useEffect(() => {
    fetch(`/api/proposals/${params.id}`).then((r) => r.json()).then(setProposal).catch(() => {});
  }, [params.id]);

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposal) return;
    const res = await fetch(`/api/proposals/${params.id}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...fbForm, authorId: "u2" }),
    });
    if (res.ok) {
      const fb = await res.json();
      setProposal({ ...proposal, feedbacks: [...proposal.feedbacks, fb] });
      setFbForm({ content: "", sentiment: "neutral" });
    }
  };

  const authorName = (id: string) => mockUsers.find((u) => u.id === id)?.name || id;

  if (!proposal) return <div className="p-6">読み込み中...</div>;

  return (
    <div className="max-w-3xl">
      <a href="/proposals" className="text-sm text-primary-600 hover:underline mb-4 inline-block">← 一覧に戻る</a>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold">{proposal.title}</h1>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {statusLabels[proposal.status]}
          </span>
        </div>
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{proposal.description}</p>
        <div className="flex gap-4 text-sm text-gray-500">
          <span>投稿者: {authorName(proposal.authorId)}</span>
          <span>カテゴリ: {proposal.category}</span>
          <span>優先度: {proposal.priority}</span>
        </div>
        {proposal.tags.length > 0 && (
          <div className="flex gap-2 mt-3">
            {proposal.tags.map((t) => (
              <span key={t} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* フィードバック一覧 */}
      <h2 className="text-lg font-semibold mb-3">フィードバック ({proposal.feedbacks.length}件)</h2>
      <div className="space-y-3 mb-6">
        {proposal.feedbacks.map((fb) => (
          <div key={fb.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
              <span>{sentimentIcons[fb.sentiment]}</span>
              <span className="font-medium text-gray-700">{authorName(fb.authorId)}</span>
              <span>{new Date(fb.createdAt).toLocaleDateString("ja-JP")}</span>
            </div>
            <p className="text-sm text-gray-700">{fb.content}</p>
          </div>
        ))}
      </div>

      {/* フィードバック投稿フォーム */}
      <form onSubmit={submitFeedback} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-3">
        <h3 className="font-semibold text-sm">フィードバックを送る</h3>
        <textarea
          required value={fbForm.content} onChange={(e) => setFbForm({ ...fbForm, content: e.target.value })}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500"
          placeholder="この提案に対するフィードバックを記入..."
        />
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {(["positive", "neutral", "negative"] as const).map((s) => (
              <button
                key={s} type="button"
                onClick={() => setFbForm({ ...fbForm, sentiment: s })}
                className={`px-3 py-1 rounded text-sm ${fbForm.sentiment === s ? "bg-primary-100 text-primary-700 ring-2 ring-primary-300" : "bg-gray-100 text-gray-600"}`}
              >
                {sentimentIcons[s]} {s === "positive" ? "賛成" : s === "neutral" ? "意見" : "懸念"}
              </button>
            ))}
          </div>
          <button type="submit" className="ml-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
            送信
          </button>
        </div>
      </form>
    </div>
  );
}
