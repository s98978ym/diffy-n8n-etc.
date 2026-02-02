"use client";

import { useEffect, useState, useCallback } from "react";
import { mockWorkflows } from "@/lib/mock-data";
import type { Workflow, WorkflowNode, WorkflowEdge } from "@/types";

const nodeTypeColors: Record<string, string> = {
  trigger: "bg-green-100 border-green-400 text-green-800",
  action: "bg-blue-100 border-blue-400 text-blue-800",
  condition: "bg-yellow-100 border-yellow-400 text-yellow-800",
  notification: "bg-purple-100 border-purple-400 text-purple-800",
  approval: "bg-orange-100 border-orange-400 text-orange-800",
  integration: "bg-indigo-100 border-indigo-400 text-indigo-800",
};

const nodeTypeLabels: Record<string, string> = {
  trigger: "トリガー",
  action: "アクション",
  condition: "条件分岐",
  notification: "通知",
  approval: "承認",
  integration: "外部連携",
};

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);
  const [selected, setSelected] = useState<Workflow | null>(null);
  const [building, setBuilding] = useState(false);
  const [newNodes, setNewNodes] = useState<WorkflowNode[]>([]);
  const [newEdges, setNewEdges] = useState<WorkflowEdge[]>([]);
  const [wfName, setWfName] = useState("");

  useEffect(() => {
    fetch("/api/workflows").then((r) => r.json()).then(setWorkflows).catch(() => {});
  }, []);

  const addNode = (type: WorkflowNode["type"]) => {
    const id = `node-${Date.now()}`;
    const x = newNodes.length * 200;
    setNewNodes([...newNodes, { id, type, label: nodeTypeLabels[type], config: {}, position: { x, y: 150 } }]);
    // 自動接続: 前のノードと繋ぐ
    if (newNodes.length > 0) {
      const prev = newNodes[newNodes.length - 1];
      setNewEdges([...newEdges, { id: `edge-${Date.now()}`, source: prev.id, target: id }]);
    }
  };

  const saveWorkflow = async () => {
    if (!wfName || newNodes.length === 0) return;
    const res = await fetch("/api/workflows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: wfName, description: "", nodes: newNodes, edges: newEdges }),
    });
    if (res.ok) {
      const wf = await res.json();
      setWorkflows([wf, ...workflows]);
      setBuilding(false);
      setNewNodes([]);
      setNewEdges([]);
      setWfName("");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">ワークフロー</h1>
        <button
          onClick={() => { setBuilding(!building); setSelected(null); }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
        >
          {building ? "キャンセル" : "+ 新しいワークフロー"}
        </button>
      </div>

      {/* ビジュアルビルダー */}
      {building && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <input
            value={wfName} onChange={(e) => setWfName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4"
            placeholder="ワークフロー名"
          />
          <div className="flex gap-2 mb-4 flex-wrap">
            {Object.keys(nodeTypeLabels).map((t) => (
              <button
                key={t}
                onClick={() => addNode(t as WorkflowNode["type"])}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${nodeTypeColors[t]}`}
              >
                + {nodeTypeLabels[t]}
              </button>
            ))}
          </div>
          {/* ノードキャンバス */}
          <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] overflow-x-auto">
            <div className="flex items-center gap-2" style={{ minWidth: newNodes.length * 200 }}>
              {newNodes.map((node, i) => (
                <div key={node.id} className="flex items-center gap-2">
                  <div className={`px-4 py-3 rounded-lg border-2 text-sm font-medium min-w-[140px] text-center ${nodeTypeColors[node.type]}`}>
                    <div className="text-[10px] opacity-60 mb-1">{nodeTypeLabels[node.type]}</div>
                    <input
                      value={node.label}
                      onChange={(e) => {
                        const updated = [...newNodes];
                        updated[i] = { ...node, label: e.target.value };
                        setNewNodes(updated);
                      }}
                      className="bg-transparent text-center w-full border-none outline-none text-sm"
                    />
                  </div>
                  {i < newNodes.length - 1 && <span className="text-gray-400">→</span>}
                </div>
              ))}
              {newNodes.length === 0 && (
                <div className="text-gray-400 text-sm">上のボタンからノードを追加してワークフローを構築</div>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={saveWorkflow} disabled={!wfName || newNodes.length === 0}
              className="px-6 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 text-sm font-medium disabled:opacity-40">
              保存して n8n に同期
            </button>
          </div>
        </div>
      )}

      {/* ワークフロー一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflows.map((wf) => (
          <div
            key={wf.id}
            onClick={() => { setSelected(selected?.id === wf.id ? null : wf); setBuilding(false); }}
            className={`bg-white rounded-xl p-5 shadow-sm border cursor-pointer transition-colors ${selected?.id === wf.id ? "border-primary-400 ring-2 ring-primary-100" : "border-gray-100 hover:border-gray-300"}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{wf.name}</h3>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${wf.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {wf.active ? "稼働中" : "停止"}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-3">{wf.description}</p>
            <div className="flex items-center gap-1 overflow-x-auto">
              {wf.nodes.map((n, i) => (
                <div key={n.id} className="flex items-center gap-1">
                  <span className={`px-2 py-1 rounded text-[10px] font-medium ${nodeTypeColors[n.type]}`}>{n.label}</span>
                  {i < wf.nodes.length - 1 && <span className="text-gray-300 text-xs">→</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 選択されたワークフロー詳細 */}
      {selected && (
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg mb-4">{selected.name} - フロー詳細</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              {selected.nodes.map((n, i) => (
                <div key={n.id} className="flex items-center gap-3">
                  <div className={`px-4 py-3 rounded-lg border-2 text-center min-w-[120px] ${nodeTypeColors[n.type]}`}>
                    <div className="text-[10px] opacity-60">{nodeTypeLabels[n.type]}</div>
                    <div className="text-sm font-medium">{n.label}</div>
                  </div>
                  {i < selected.nodes.length - 1 && <span className="text-gray-400 text-lg">→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
