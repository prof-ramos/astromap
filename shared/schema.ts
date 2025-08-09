import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const birthData = pgTable("birth_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  birthDate: text("birth_date").notNull(),
  birthTime: text("birth_time").notNull(),
  birthCity: text("birth_city").notNull(),
  timezone: text("timezone").default("America/Sao_Paulo"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const astralChart = pgTable("astral_chart", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  birthDataId: varchar("birth_data_id").references(() => birthData.id),
  svgData: text("svg_data").notNull(),
  chartData: text("chart_data").notNull(), // JSON string
  sunSign: text("sun_sign").notNull(),
  moonSign: text("moon_sign").notNull(),
  risingSign: text("rising_sign").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBirthDataSchema = createInsertSchema(birthData).pick({
  name: true,
  birthDate: true,
  birthTime: true,
  birthCity: true,
  timezone: true,
  latitude: true,
  longitude: true,
}).extend({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, "Hora deve estar no formato HH:MM"),
  birthCity: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
});

export const insertAstralChartSchema = createInsertSchema(astralChart).pick({
  birthDataId: true,
  svgData: true,
  chartData: true,
  sunSign: true,
  moonSign: true,
  risingSign: true,
});

export type InsertBirthData = z.infer<typeof insertBirthDataSchema>;
export type BirthData = typeof birthData.$inferSelect;
export type InsertAstralChart = z.infer<typeof insertAstralChartSchema>;
export type AstralChart = typeof astralChart.$inferSelect;

// API response types
export interface ChartGenerationResponse {
  success: boolean;
  chart?: AstralChart;
  error?: string;
}

export interface PlanetPosition {
  name: string;
  sign: string;
  degree: number;
  house: number;
  symbol: string;
}

export interface HouseData {
  number: number;
  sign: string;
  degree: number;
  ruler: string;
}

export interface AspectData {
  planet1: string;
  planet2: string;
  aspect: string;
  orb: number;
  symbol: string;
}

export interface ParsedChartData {
  planets: PlanetPosition[];
  houses: HouseData[];
  aspects: AspectData[];
  sunSign: string;
  moonSign: string;
  risingSign: string;
}
