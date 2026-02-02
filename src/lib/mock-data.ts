import type { Proposal, User, Workflow, DashboardStats } from "@/types";

export const mockUsers: User[] = [
  { id: "u1", name: "田中 太郎", role: "manager", team: "製造部" },
  { id: "u2", name: "佐藤 花子", role: "member", team: "製造部" },
  { id: "u3", name: "鈴木 一郎", role: "member", team: "製造部" },
  { id: "u4", name: "山田 美咲", role: "manager", team: "品質管理部" },
];

export const mockProposals: Proposal[] = [
  {
    id: "p1",
    title: "朝礼の効率化",
    description: "朝礼を15分→5分に短縮し、詳細共有はチャットで行う運用に変更する提案",
    authorId: "u1",
    status: "open",
    category: "コミュニケーション",
    priority: "medium",
    createdAt: "2026-01-20T09:00:00Z",
    updatedAt: "2026-01-28T14:00:00Z",
    feedbacks: [
      { id: "f1", proposalId: "p1", authorId: "u2", content: "チャットだと見落としが心配。通知ルールも決めたい", sentiment: "neutral", createdAt: "2026-01-21T10:00:00Z" },
      { id: "f2", proposalId: "p1", authorId: "u3", content: "大賛成。移動時間も減るので助かる", sentiment: "positive", createdAt: "2026-01-21T11:00:00Z" },
    ],
    workflowId: "w1",
    diffSnapshots: [],
    tags: ["朝礼", "時短"],
  },
  {
    id: "p2",
    title: "検品チェックリストのデジタル化",
    description: "紙の検品チェックリストをタブレット入力に切り替え、リアルタイムで不良率を可視化する",
    authorId: "u4",
    status: "approved",
    category: "品質管理",
    priority: "high",
    createdAt: "2026-01-15T08:00:00Z",
    updatedAt: "2026-01-30T16:00:00Z",
    feedbacks: [
      { id: "f3", proposalId: "p2", authorId: "u2", content: "入力UIがシンプルなら現場でも使えそう", sentiment: "positive", createdAt: "2026-01-16T09:00:00Z" },
    ],
    diffSnapshots: [],
    tags: ["検品", "デジタル化", "品質"],
  },
  {
    id: "p3",
    title: "シフト自動最適化",
    description: "メンバーの希望と業務量データから最適シフトを自動生成するワークフローを導入",
    authorId: "u1",
    status: "in_review",
    category: "労務管理",
    priority: "high",
    createdAt: "2026-01-25T07:00:00Z",
    updatedAt: "2026-02-01T10:00:00Z",
    feedbacks: [],
    workflowId: "w2",
    diffSnapshots: [],
    tags: ["シフト", "自動化"],
  },
];

export const mockWorkflows: Workflow[] = [
  {
    id: "w1",
    name: "提案承認フロー",
    description: "改善提案が投稿されたらマネージャーに通知し、承認を待つ",
    active: true,
    createdAt: "2026-01-18T10:00:00Z",
    updatedAt: "2026-01-28T14:00:00Z",
    nodes: [
      { id: "n1", type: "trigger", label: "提案投稿", config: {}, position: { x: 0, y: 150 } },
      { id: "n2", type: "notification", label: "マネージャー通知", config: {}, position: { x: 250, y: 150 } },
      { id: "n3", type: "approval", label: "承認判定", config: {}, position: { x: 500, y: 150 } },
      { id: "n4", type: "action", label: "ステータス更新", config: {}, position: { x: 750, y: 150 } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2" },
      { id: "e2", source: "n2", target: "n3" },
      { id: "e3", source: "n3", target: "n4" },
    ],
  },
  {
    id: "w2",
    name: "シフト最適化フロー",
    description: "毎週月曜にシフトデータを収集し最適化を実行",
    active: false,
    createdAt: "2026-01-25T07:00:00Z",
    updatedAt: "2026-02-01T10:00:00Z",
    nodes: [
      { id: "n5", type: "trigger", label: "スケジュール起動", config: { cron: "0 6 * * 1" }, position: { x: 0, y: 150 } },
      { id: "n6", type: "action", label: "データ収集", config: {}, position: { x: 250, y: 150 } },
      { id: "n7", type: "action", label: "最適化実行", config: {}, position: { x: 500, y: 150 } },
      { id: "n8", type: "notification", label: "結果通知", config: {}, position: { x: 750, y: 150 } },
    ],
    edges: [
      { id: "e4", source: "n5", target: "n6" },
      { id: "e5", source: "n6", target: "n7" },
      { id: "e6", source: "n7", target: "n8" },
    ],
  },
];

export const mockStats: DashboardStats = {
  totalProposals: 24,
  activeProposals: 8,
  implementedCount: 12,
  feedbackCount: 67,
  activeWorkflows: 5,
  improvementRate: 78,
};
