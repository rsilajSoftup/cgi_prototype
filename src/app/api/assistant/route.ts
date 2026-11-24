import { NextResponse } from "next/server";

import { generateAssistantResponse } from "@/lib/ai/engine";
import type { AssistantRequest } from "@/lib/ai/types";

/**
 * Local simulated assistant. Does not call an external model and does not
 * require an API key. A future integration should keep any real model call
 * on the server and must not log personal data.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as AssistantRequest;
  const response = generateAssistantResponse(body);
  return NextResponse.json(response);
}
