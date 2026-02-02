import { NextResponse } from "next/server";
import { mockWorkflows } from "@/lib/mock-data";
import type { Workflow } from "@/types";

let workflows: Workflow[] = [...mockWorkflows];

export async function GET() {
  return NextResponse.json(workflows);
}

export async function POST(request: Request) {
  const body = await request.json();
  const workflow: Workflow = {
    id: crypto.randomUUID(),
    name: body.name,
    description: body.description || "",
    nodes: body.nodes || [],
    edges: body.edges || [],
    active: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  workflows = [workflow, ...workflows];
  return NextResponse.json(workflow, { status: 201 });
}
