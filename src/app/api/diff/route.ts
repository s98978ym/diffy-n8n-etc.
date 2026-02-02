import { NextResponse } from "next/server";
import { createDiffSnapshot, formatDiffForDisplay } from "@/lib/diffy-client";

export async function POST(request: Request) {
  const { proposalId, before, after, description } = await request.json();
  const snapshot = createDiffSnapshot(proposalId, before, after, description || "");
  const display = formatDiffForDisplay(snapshot);
  return NextResponse.json({ snapshot, display });
}
