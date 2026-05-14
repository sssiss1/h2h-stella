import type { DmProvider, GenerateTurnRequest, GenerateTurnResult } from "./types";

export const openAIProvider: DmProvider = {
  id: "openai",
  async generateTurn(_request: GenerateTurnRequest): Promise<GenerateTurnResult> {
    throw new Error("OpenAI provider is not configured in version 1. Use mock mode.");
  }
};
