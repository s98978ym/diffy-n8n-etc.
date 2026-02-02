import { NextResponse } from "next/server";
import { mockProposals } from "@/lib/mock-data";
import type { Proposal } from "@/types";

// インメモリストア（本番ではDB）
let proposals: Proposal[] = [...mockProposals];

export async function GET() {
  return NextResponse.json(proposals);
}

export async function POST(request: Request) {
  const body = await request.json();
  const proposal: Proposal = {
    id: crypto.randomUUID(),
    title: body.title,
    description: body.description,
    authorId: body.authorId,
    status: "draft",
    category: body.category || "未分類",
    priority: body.priority || "medium",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    feedbacks: [],
    diffSnapshots: [],
    tags: body.tags || [],
  };
  proposals = [proposal, ...proposals];
  return NextResponse.json(proposal, { status: 201 });
}
