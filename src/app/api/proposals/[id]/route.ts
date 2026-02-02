import { NextResponse } from "next/server";
import { mockProposals } from "@/lib/mock-data";
import type { Proposal } from "@/types";

let proposals: Proposal[] = [...mockProposals];

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const proposal = proposals.find((p) => p.id === params.id);
  if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(proposal);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const idx = proposals.findIndex((p) => p.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  proposals[idx] = { ...proposals[idx], ...body, updatedAt: new Date().toISOString() };
  return NextResponse.json(proposals[idx]);
}
