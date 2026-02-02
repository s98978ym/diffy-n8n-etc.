// ========================================
// KaizenFlow - 業務改革SaaS データモデル
// ========================================

/** ユーザーの役割 */
export type Role = "manager" | "member";

/** 提案のステータス */
export type ProposalStatus = "draft" | "open" | "in_review" | "approved" | "implemented" | "rejected";

/** ワークフローノードの種類 */
export type NodeType = "trigger" | "action" | "condition" | "notification" | "approval" | "integration";

/** ユーザー */
export interface User {
  id: string;
  name: string;
  role: Role;
  team: string;
  avatarUrl?: string;
}

/** 改善提案 */
export interface Proposal {
  id: string;
  title: string;
  description: string;
  authorId: string;
  status: ProposalStatus;
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  updatedAt: string;
  feedbacks: Feedback[];
  workflowId?: string;
  diffSnapshots: DiffSnapshot[];
  tags: string[];
}

/** フィードバック */
export interface Feedback {
  id: string;
  proposalId: string;
  authorId: string;
  content: string;
  sentiment: "positive" | "neutral" | "negative";
  createdAt: string;
}

/** Diffy差分スナップショット */
export interface DiffSnapshot {
  id: string;
  proposalId: string;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  changedFields: string[];
  createdAt: string;
  description: string;
}

/** n8nワークフロー定義 */
export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** ワークフローノード */
export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  config: Record<string, unknown>;
  position: { x: number; y: number };
}

/** ワークフローエッジ */
export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

/** ダッシュボード統計 */
export interface DashboardStats {
  totalProposals: number;
  activeProposals: number;
  implementedCount: number;
  feedbackCount: number;
  activeWorkflows: number;
  improvementRate: number;
}
