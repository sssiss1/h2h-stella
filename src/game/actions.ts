import { mockProvider } from "@/game/providers/mockProvider";
import type { GenerateTurnRequest, GenerateTurnResult } from "@/game/providers/types";

export async function generateGameTurn(request: GenerateTurnRequest): Promise<GenerateTurnResult> {
  return mockProvider.generateTurn(request);
}
