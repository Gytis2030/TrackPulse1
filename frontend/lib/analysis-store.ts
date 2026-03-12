import { TrendAnalysisResult } from "./types";

type StoreShape = {
  analyses: TrendAnalysisResult[];
};

const globalStore = globalThis as typeof globalThis & {
  __trackPulseStore?: StoreShape;
};

const store = globalStore.__trackPulseStore ?? { analyses: [] };
globalStore.__trackPulseStore = store;

export function saveAnalysis(result: TrendAnalysisResult): void {
  store.analyses = [result, ...store.analyses.filter((entry) => entry.id !== result.id)].slice(0, 20);
}

export function getAllAnalyses(): TrendAnalysisResult[] {
  return [...store.analyses];
}

export function getAnalysisById(id: string): TrendAnalysisResult | undefined {
  return store.analyses.find((entry) => entry.id === id);
}
