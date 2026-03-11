import { promises as fs } from 'fs';
import path from 'path';
import type { AnalysisResult } from '@/types/analysis';

const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'analyses.json');

async function readAll(): Promise<AnalysisResult[]> {
  try {
    const raw = await fs.readFile(dataFile, 'utf-8');
    return JSON.parse(raw) as AnalysisResult[];
  } catch {
    return [];
  }
}

async function writeAll(items: AnalysisResult[]) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(items, null, 2), 'utf-8');
}

export async function saveAnalysis(result: AnalysisResult): Promise<void> {
  const items = await readAll();
  items.unshift(result);
  await writeAll(items.slice(0, 50));
}

export async function getAnalyses(): Promise<AnalysisResult[]> {
  return readAll();
}

export async function getAnalysisById(id: string): Promise<AnalysisResult | null> {
  const items = await readAll();
  return items.find((item) => item.id === id) ?? null;
}
