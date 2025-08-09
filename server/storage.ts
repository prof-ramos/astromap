import { type BirthData, type InsertBirthData, type AstralChart, type InsertAstralChart } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createBirthData(data: InsertBirthData): Promise<BirthData>;
  getBirthData(id: string): Promise<BirthData | undefined>;
  createAstralChart(data: InsertAstralChart): Promise<AstralChart>;
  getAstralChart(id: string): Promise<AstralChart | undefined>;
  getAstralChartByBirthDataId(birthDataId: string): Promise<AstralChart | undefined>;
}

export class MemStorage implements IStorage {
  private birthDataMap: Map<string, BirthData>;
  private astralChartMap: Map<string, AstralChart>;

  constructor() {
    this.birthDataMap = new Map();
    this.astralChartMap = new Map();
  }

  async createBirthData(insertData: InsertBirthData): Promise<BirthData> {
    const id = randomUUID();
    const birthData: BirthData = {
      ...insertData,
      id,
      timezone: insertData.timezone || "America/Sao_Paulo",
      latitude: insertData.latitude || null,
      longitude: insertData.longitude || null,
      createdAt: new Date(),
    };
    this.birthDataMap.set(id, birthData);
    return birthData;
  }

  async getBirthData(id: string): Promise<BirthData | undefined> {
    return this.birthDataMap.get(id);
  }

  async createAstralChart(insertData: InsertAstralChart): Promise<AstralChart> {
    const id = randomUUID();
    const astralChart: AstralChart = {
      ...insertData,
      id,
      createdAt: new Date(),
    };
    this.astralChartMap.set(id, astralChart);
    return astralChart;
  }

  async getAstralChart(id: string): Promise<AstralChart | undefined> {
    return this.astralChartMap.get(id);
  }

  async getAstralChartByBirthDataId(birthDataId: string): Promise<AstralChart | undefined> {
    return Array.from(this.astralChartMap.values()).find(
      (chart) => chart.birthDataId === birthDataId
    );
  }
}

export const storage = new MemStorage();
