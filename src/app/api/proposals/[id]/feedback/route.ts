import { NextResponse } from "next/server";
import { mockProposals } from "@/lib/mock-data";
import type { Proposal, Feedback } from "@/types";

let proposals: Proposal[] = [...mockProposals];

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const idx = proposals.findIndex((p) => p.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const feedback: Feedback = {
    id: crypto.randomUUID(),
    proposalId: params.id,
    authorId: body.authorId,
    content: body.content,
    sentiment: body.sentiment || "neutral",
    createdAt: new Date().toISOString(),
  };

  proposals[idx].feedbacks.push(feedback);
  proposals[idx].updatedAt = new Date().toISOString();
  return NextResponse.json(feedback, { status: 201 });
}
