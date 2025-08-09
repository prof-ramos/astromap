import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBirthDataSchema, type ChartGenerationResponse, type ParsedChartData } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { getSwaggerHtml, openApiSpec } from "./openapi";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate astral chart
  app.post("/api/generate-chart", async (req, res) => {
    try {
      // Validate request body
      const validationResult = insertBirthDataSchema.safeParse(req.body);
      if (!validationResult.success) {
        const error = fromZodError(validationResult.error);
        return res.status(400).json({
          success: false,
          error: error.message
        } as ChartGenerationResponse);
      }

      const birthData = validationResult.data;

      // Get coordinates for the city (simplified - in production would use geocoding API)
      const coordinates = await getCityCoordinates(birthData.birthCity);
      if (coordinates) {
        birthData.latitude = coordinates.lat;
        birthData.longitude = coordinates.lng;
      }

      // Store birth data
      const storedBirthData = await storage.createBirthData(birthData);

      // Call RapidAPI Astrologer
      const chartData = await generateChartFromAPI(storedBirthData);
      
      if (!chartData) {
        return res.status(500).json({
          success: false,
          error: "Falha ao gerar mapa astral. Tente novamente."
        } as ChartGenerationResponse);
      }

      // Generate SVG
      const svgData = generateChartSVG(chartData);

      // Store astral chart
      const astralChart = await storage.createAstralChart({
        birthDataId: storedBirthData.id,
        svgData,
        chartData: JSON.stringify(chartData),
        sunSign: chartData.sunSign,
        moonSign: chartData.moonSign,
        risingSign: chartData.risingSign,
      });

      res.json({
        success: true,
        chart: astralChart
      } as ChartGenerationResponse);

    } catch (error) {
      console.error("Chart generation error:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor"
      } as ChartGenerationResponse);
    }
  });

  // OpenAPI JSON
  app.get("/api/openapi.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(openApiSpec));
  });

  // Swagger UI
  app.get("/api/docs", (_req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(getSwaggerHtml());
  });

  // Download SVG
  app.get("/api/download-svg/:chartId", async (req, res) => {
    try {
      const chart = await storage.getAstralChart(req.params.chartId);
      if (!chart) {
        return res.status(404).json({ error: "Mapa astral não encontrado" });
      }

      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Content-Disposition', `attachment; filename="mapa-astral-${chart.id}.svg"`);
      res.send(chart.svgData);
    } catch (error) {
      res.status(500).json({ error: "Erro ao baixar SVG" });
    }
  });

  // Generate and download PDF report
  app.get("/api/download-pdf/:chartId", async (req, res) => {
    try {
      const chart = await storage.getAstralChart(req.params.chartId);
      if (!chart) {
        return res.status(404).json({ error: "Mapa astral não encontrado" });
      }

      const birthData = await storage.getBirthData(chart.birthDataId!);
      if (!birthData) {
        return res.status(404).json({ error: "Dados de nascimento não encontrados" });
      }

      const pdfBuffer = await generatePDFReport(chart, birthData);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="relatorio-astral-${chart.id}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ error: "Erro ao gerar PDF" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions
async function getCityCoordinates(city: string): Promise<{ lat: number; lng: number } | null> {
  // Simplified coordinates for major Brazilian cities
  const cityCoords: Record<string, { lat: number; lng: number }> = {
    'São Paulo': { lat: -23.5505, lng: -46.6333 },
    'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
    'Belo Horizonte': { lat: -19.9208, lng: -43.9378 },
    'Brasília': { lat: -15.8267, lng: -47.9218 },
    'Salvador': { lat: -12.9714, lng: -38.5014 },
    'Fortaleza': { lat: -3.7319, lng: -38.5267 },
    'Recife': { lat: -8.0476, lng: -34.8770 },
  };

  const normalizedCity = city.replace(/,.*/, '').trim();
  return cityCoords[normalizedCity] || null;
}

async function generateChartFromAPI(birthData: any): Promise<ParsedChartData | null> {
  try {
    const rapidApiKey = process.env.RAPIDAPI_KEY || process.env.ASTROLOGER_API_KEY || "";
    
    if (!rapidApiKey) {
      throw new Error("API key not configured");
    }

    const requestData = {
      date: birthData.birthDate,
      time: birthData.birthTime,
      latitude: birthData.latitude || -23.5505,
      longitude: birthData.longitude || -46.6333,
      timezone: birthData.timezone || "America/Sao_Paulo"
    };

    const response = await fetch('https://astrologer.p.rapidapi.com/api/v4/birth-chart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'astrologer.p.rapidapi.com'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const apiData = await response.json();
    
    // Parse API response into our format
    return parseAstrologyAPIResponse(apiData);
  } catch (error) {
    console.error("API call failed:", error);
    return null;
  }
}

function parseAstrologyAPIResponse(apiData: any): ParsedChartData {
  // This would parse the actual API response
  // For now, providing a structured response based on typical astrology API formats
  return {
    planets: apiData.planets?.map((p: any) => ({
      name: p.name,
      sign: p.sign,
      degree: p.degree,
      house: p.house,
      symbol: getZodiacSymbol(p.sign)
    })) || [],
    houses: apiData.houses?.map((h: any, index: number) => ({
      number: index + 1,
      sign: h.sign,
      degree: h.degree,
      ruler: h.ruler
    })) || [],
    aspects: apiData.aspects?.map((a: any) => ({
      planet1: a.planet1,
      planet2: a.planet2,
      aspect: a.aspect,
      orb: a.orb,
      symbol: getAspectSymbol(a.aspect)
    })) || [],
    sunSign: apiData.sun?.sign || "Áries",
    moonSign: apiData.moon?.sign || "Touro", 
    risingSign: apiData.ascendant?.sign || "Gêmeos"
  };
}

function getZodiacSymbol(sign: string): string {
  const symbols: Record<string, string> = {
    'Áries': '♈', 'Touro': '♉', 'Gêmeos': '♊', 'Câncer': '♋',
    'Leão': '♌', 'Virgem': '♍', 'Libra': '♎', 'Escorpião': '♏',
    'Sagitário': '♐', 'Capricórnio': '♑', 'Aquário': '♒', 'Peixes': '♓'
  };
  return symbols[sign] || '♈';
}

function getAspectSymbol(aspect: string): string {
  const symbols: Record<string, string> = {
    'conjunção': '☌', 'oposição': '☍', 'trígono': '△', 'quadratura': '□',
    'sextil': '⚹', 'quincúncio': '⚻'
  };
  return symbols[aspect] || '☌';
}

function generateChartSVG(chartData: ParsedChartData): string {
  const svgWidth = 500;
  const svgHeight = 500;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const outerRadius = 200;
  const innerRadius = 150;
  const planetRadius = 125;

  let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}">
    <defs>
      <radialGradient id="chartGradient" cx="50%" cy="50%" r="60%">
        <stop offset="0%" style="stop-color:#E9F9FF;stop-opacity:0.3" />
        <stop offset="50%" style="stop-color:#3FCFF9;stop-opacity:0.1" />
        <stop offset="100%" style="stop-color:#88ff47;stop-opacity:0.05" />
      </radialGradient>
      <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#3FCFF9;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#88ff47;stop-opacity:0.6" />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="2" dy="2" stdDeviation="2" flood-opacity="0.3"/>
      </filter>
    </defs>
    
    <!-- Background -->
    <rect width="100%" height="100%" fill="url(#chartGradient)"/>
    
    <!-- Outer decorative circle -->
    <circle cx="${centerX}" cy="${centerY}" r="${outerRadius + 15}" 
            fill="none" stroke="url(#borderGradient)" stroke-width="1" opacity="0.4"/>
    
    <!-- Main chart circles -->
    <circle cx="${centerX}" cy="${centerY}" r="${outerRadius}" 
            fill="none" stroke="#3FCFF9" stroke-width="2.5" filter="url(#glow)"/>
    <circle cx="${centerX}" cy="${centerY}" r="${innerRadius}" 
            fill="none" stroke="#88ff47" stroke-width="1.5" opacity="0.7"/>
    <circle cx="${centerX}" cy="${centerY}" r="${planetRadius}" 
            fill="none" stroke="#3FCFF9" stroke-width="1" stroke-dasharray="8,4" opacity="0.5"/>
    
    <!-- Center point -->
    <circle cx="${centerX}" cy="${centerY}" r="4" fill="#3FCFF9" filter="url(#glow)"/>`;

  // Add zodiac signs around the outer circle
  const zodiacSigns = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
  const signColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FF6B6B', '#4ECDC4', 
                     '#45B7D1', '#96CEB4', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
  
  zodiacSigns.forEach((sign, index) => {
    const angle = (index * 30 - 90) * Math.PI / 180;
    const x = centerX + Math.cos(angle) * (outerRadius + 35);
    const y = centerY + Math.sin(angle) * (outerRadius + 35);
    
    // Sign background circle
    svg += `<circle cx="${x}" cy="${y}" r="16" fill="${signColors[index]}" opacity="0.2" filter="url(#shadow)"/>
            <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" 
                  fill="${signColors[index]}" font-size="22" font-family="serif" font-weight="bold"
                  filter="url(#glow)">${sign}</text>`;
  });

  // Add house divisions with numbers
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 - 90) * Math.PI / 180;
    const x1 = centerX + Math.cos(angle) * planetRadius;
    const y1 = centerY + Math.sin(angle) * planetRadius;
    const x2 = centerX + Math.cos(angle) * outerRadius;
    const y2 = centerY + Math.sin(angle) * outerRadius;
    
    // House division lines
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
                  stroke="#88ff47" stroke-width="1.5" opacity="0.6"/>`;
    
    // House numbers
    const numAngle = ((i * 30) + 15 - 90) * Math.PI / 180;
    const numX = centerX + Math.cos(numAngle) * (planetRadius - 20);
    const numY = centerY + Math.sin(numAngle) * (planetRadius - 20);
    
    svg += `<circle cx="${numX}" cy="${numY}" r="12" fill="rgba(136, 255, 71, 0.3)" stroke="#88ff47" stroke-width="1"/>
            <text x="${numX}" y="${numY}" text-anchor="middle" dominant-baseline="central" 
                  fill="#88ff47" font-size="12" font-weight="bold">${i + 1}</text>`;
  }

  // Add planets with enhanced styling
  const planetSymbols = ['☉', '☽', '☿', '♀', '♂', '♃', '♄', '♅', '♆', '♇'];
  chartData.planets.slice(0, 10).forEach((planet, index) => {
    const baseAngle = (index * 36 - 90) * Math.PI / 180; // Distribute evenly
    const radiusVariation = planetRadius + (index % 2 === 0 ? -15 : 15); // Alternate inner/outer
    const x = centerX + Math.cos(baseAngle) * radiusVariation;
    const y = centerY + Math.sin(baseAngle) * radiusVariation;
    
    // Planet glow effect
    svg += `<circle cx="${x}" cy="${y}" r="14" fill="rgba(63, 207, 249, 0.2)" filter="url(#glow)"/>
            <circle cx="${x}" cy="${y}" r="12" fill="#3FCFF9" opacity="0.9" filter="url(#shadow)"/>
            <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" 
                  fill="white" font-size="16" font-weight="bold" 
                  font-family="serif">${planetSymbols[index] || planet.symbol}</text>`;
    
    // Planet name label
    const labelX = x + (x > centerX ? 20 : -20);
    const labelY = y - 20;
    svg += `<text x="${labelX}" y="${labelY}" text-anchor="${x > centerX ? 'start' : 'end'}" 
                  fill="#222222" font-size="10" font-weight="500" opacity="0.8">${planet.name}</text>`;
  });

  // Add decorative elements
  svg += `
    <!-- Decorative stars -->
    <text x="50" y="50" fill="#3FCFF9" font-size="16" opacity="0.4">✦</text>
    <text x="${svgWidth - 50}" y="50" fill="#88ff47" font-size="12" opacity="0.4">✧</text>
    <text x="50" y="${svgHeight - 50}" fill="#88ff47" font-size="14" opacity="0.4">✦</text>
    <text x="${svgWidth - 50}" y="${svgHeight - 50}" fill="#3FCFF9" font-size="10" opacity="0.4">✧</text>
    
    <!-- Title -->
    <text x="${centerX}" y="30" text-anchor="middle" fill="#222222" 
          font-size="18" font-weight="bold" font-family="serif">Mapa Astral</text>
    <text x="${centerX}" y="50" text-anchor="middle" fill="#666666" 
          font-size="12">Carta Natal Personalizada</text>
  </svg>`;

  return svg;
}

async function generatePDFReport(chart: any, birthData: any): Promise<Buffer> {
  // In a real implementation, this would use a PDF library like puppeteer or jsPDF
  // For now, returning a simple text-based report as a buffer
  const chartDataParsed = JSON.parse(chart.chartData);
  
  const reportText = `
RELATÓRIO DE MAPA ASTRAL

Nome: ${birthData.name}
Data de Nascimento: ${birthData.birthDate}
Hora: ${birthData.birthTime}
Local: ${birthData.birthCity}

SIGNOS PRINCIPAIS:
☉ Sol: ${chartDataParsed.sunSign}
☽ Lua: ${chartDataParsed.moonSign}  
↗ Ascendente: ${chartDataParsed.risingSign}

POSIÇÕES PLANETÁRIAS:
${chartDataParsed.planets.map((p: any) => `${p.name}: ${p.sign} - ${p.degree.toFixed(2)}° (Casa ${p.house})`).join('\n')}

CASAS ASTROLÓGICAS:
${chartDataParsed.houses.map((h: any) => `Casa ${h.number}: ${h.sign} - ${h.degree.toFixed(2)}°`).join('\n')}

ASPECTOS PRINCIPAIS:
${chartDataParsed.aspects.map((a: any) => `${a.planet1} ${a.symbol} ${a.planet2} (Orbe: ${a.orb.toFixed(1)}°)`).join('\n')}

---
Relatório gerado por Psicóloga Em Outra Dimensão
www.psicologaemoutradimensao.com
`;

  return Buffer.from(reportText, 'utf-8');
}
