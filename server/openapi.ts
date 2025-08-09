// OpenAPI 3.0.3 specification for the Astral Chart API
// Kept as a runtime-exported object to be served at /api/openapi.json

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Astral Chart API",
    version: "1.0.0",
    description:
      "API para geração de mapas astrais, download de SVG e PDF. Não requer autenticação. Configuração de chave da RapidAPI é feita no servidor.",
    contact: {
      name: "Psicóloga Em Outra Dimensão",
      url: "https://www.psicologaemoutradimensao.com",
    },
    license: {
      name: "MIT",
    },
  },
  servers: [
    { url: "/", description: "Servidor atual" },
  ],
  tags: [
    { name: "Charts", description: "Geração e download de mapas astrais" },
  ],
  paths: {
    "/api/generate-chart": {
      post: {
        tags: ["Charts"],
        summary: "Gera um mapa astral",
        description:
          "Valida dados de nascimento, consulta serviço externo de astrologia, gera SVG e retorna metadados do mapa astral armazenado.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/InsertBirthData" },
              examples: {
                exemplo: {
                  value: {
                    name: "Maria Silva",
                    birthDate: "1990-05-20",
                    birthTime: "14:30",
                    birthCity: "São Paulo",
                    timezone: "America/Sao_Paulo",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Mapa astral gerado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ChartGenerationResponse" },
              },
            },
          },
          "400": {
            description: "Erro de validação dos dados de entrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "Erro interno ao gerar o mapa",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/download-svg/{chartId}": {
      get: {
        tags: ["Charts"],
        summary: "Baixa o SVG do mapa astral",
        parameters: [
          {
            name: "chartId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID do mapa astral",
          },
        ],
        responses: {
          "200": {
            description: "SVG retornado",
            content: {
              "image/svg+xml": {
                schema: { type: "string" },
              },
            },
          },
          "404": {
            description: "Mapa astral não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "Erro ao baixar SVG",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/download-pdf/{chartId}": {
      get: {
        tags: ["Charts"],
        summary: "Gera e baixa o PDF do mapa astral",
        parameters: [
          {
            name: "chartId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID do mapa astral",
          },
        ],
        responses: {
          "200": {
            description: "PDF retornado",
            content: {
              "application/pdf": {
                schema: { type: "string", format: "binary" },
              },
            },
          },
          "404": {
            description: "Mapa astral ou dados de nascimento não encontrados",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "Erro ao gerar PDF",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/openapi.json": {
      get: {
        tags: ["Docs"],
        summary: "Retorna a especificação OpenAPI",
        responses: {
          "200": {
            description: "OpenAPI JSON",
            content: {
              "application/json": { schema: { type: "object" } },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      InsertBirthData: {
        type: "object",
        required: ["name", "birthDate", "birthTime", "birthCity"],
        properties: {
          name: { type: "string", minLength: 2 },
          birthDate: {
            type: "string",
            pattern: "^\\d{4}-\\d{2}-\\d{2}$",
            example: "1990-05-20",
            description: "Formato YYYY-MM-DD",
          },
          birthTime: {
            type: "string",
            pattern: "^\\d{2}:\\d{2}$",
            example: "14:30",
            description: "Formato HH:MM",
          },
          birthCity: { type: "string", minLength: 2 },
          timezone: {
            type: "string",
            default: "America/Sao_Paulo",
            description: "IANA timezone",
          },
          latitude: { type: "number", nullable: true },
          longitude: { type: "number", nullable: true },
        },
      },
      AstralChart: {
        type: "object",
        properties: {
          id: { type: "string" },
          birthDataId: { type: "string" },
          svgData: { type: "string", description: "SVG do mapa" },
          chartData: { type: "string", description: "JSON string com dados astrais" },
          sunSign: { type: "string" },
          moonSign: { type: "string" },
          risingSign: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      ChartGenerationResponse: {
        type: "object",
        required: ["success"],
        properties: {
          success: { type: "boolean" },
          chart: { $ref: "#/components/schemas/AstralChart" },
          error: { type: "string" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: { type: "string" },
        },
      },
    },
  },
} as const;

export function getSwaggerHtml(pageTitle = "Astral Chart API Docs"): string {
  // Minimal Swagger UI HTML using unpkg CDN
  return `<!doctype html>
<html lang="pt-br">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${pageTitle}</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      body { margin: 0; background: #0b1020; }
      .swagger-ui .topbar { display: none; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: '/api/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis],
        layout: 'BaseLayout',
        defaultModelsExpandDepth: 1,
      });
    </script>
  </body>
</html>`;
}


