/**
 * n8n ワークフロー連携クライアント
 * n8nのREST APIを通じてワークフローの作成・実行・管理を行う
 */

const N8N_BASE_URL = process.env.N8N_BASE_URL || "http://localhost:5678";
const N8N_API_KEY = process.env.N8N_API_KEY || "";

interface N8nWorkflowPayload {
  name: string;
  nodes: N8nNode[];
  connections: Record<string, Record<string, Array<Array<{ node: string; type: string; index: number }>>>>;
  active: boolean;
}

interface N8nNode {
  name: string;
  type: string;
  position: [number, number];
  parameters: Record<string, unknown>;
}

async function n8nFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${N8N_BASE_URL}/api/v1${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-N8N-API-KEY": N8N_API_KEY,
      ...options.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`n8n API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/** ワークフロー一覧取得 */
export async function listWorkflows() {
  return n8nFetch("/workflows");
}

/** ワークフロー作成 */
export async function createWorkflow(payload: N8nWorkflowPayload) {
  return n8nFetch("/workflows", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** ワークフロー有効化 */
export async function activateWorkflow(id: string) {
  return n8nFetch(`/workflows/${id}/activate`, { method: "POST" });
}

/** ワークフロー無効化 */
export async function deactivateWorkflow(id: string) {
  return n8nFetch(`/workflows/${id}/deactivate`, { method: "POST" });
}

/** ワークフロー手動実行 */
export async function executeWorkflow(id: string, data?: Record<string, unknown>) {
  return n8nFetch(`/workflows/${id}/run`, {
    method: "POST",
    body: JSON.stringify({ data }),
  });
}

/** ワークフロー実行履歴取得 */
export async function getExecutions(workflowId: string) {
  return n8nFetch(`/executions?workflowId=${workflowId}`);
}

/**
 * 改善提案の承認ワークフローテンプレートを生成
 * GUIビルダーから呼ばれる簡易テンプレート
 */
export function buildApprovalWorkflowTemplate(proposalTitle: string): N8nWorkflowPayload {
  return {
    name: `承認フロー: ${proposalTitle}`,
    active: false,
    nodes: [
      {
        name: "提案トリガー",
        type: "n8n-nodes-base.webhook",
        position: [250, 300],
        parameters: { path: "proposal-trigger", httpMethod: "POST" },
      },
      {
        name: "マネージャー通知",
        type: "n8n-nodes-base.slack",
        position: [500, 300],
        parameters: { channel: "#kaizen", text: `新しい改善提案: ${proposalTitle}` },
      },
      {
        name: "承認待ち",
        type: "n8n-nodes-base.wait",
        position: [750, 300],
        parameters: { resume: "webhook" },
      },
      {
        name: "結果通知",
        type: "n8n-nodes-base.slack",
        position: [1000, 300],
        parameters: { channel: "#kaizen", text: "提案が承認されました" },
      },
    ],
    connections: {
      "提案トリガー": { main: [[{ node: "マネージャー通知", type: "main", index: 0 }]] },
      "マネージャー通知": { main: [[{ node: "承認待ち", type: "main", index: 0 }]] },
      "承認待ち": { main: [[{ node: "結果通知", type: "main", index: 0 }]] },
    },
  };
}
