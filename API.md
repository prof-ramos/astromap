### Documentação de API — Astral Chart API

Esta API permite gerar mapas astrais, além de baixar SVG e PDF. Um playground interativo está disponível em `/api/docs`. A especificação OpenAPI está em `/api/openapi.json`.

### Visão Geral

- **Base URL**: `http://localhost:5000`
- **Autenticação**: Não requerida para endpoints públicos
- **Formato**: JSON para requisições e respostas; `image/svg+xml` e `application/pdf` para downloads
- **Rate limiting**: recomenda-se ≤ 60 req/min por IP (implemente na borda/reverse proxy)

### Endpoints

1) POST `/api/generate-chart`

- **Descrição**: Valida dados de nascimento, consulta serviço externo de astrologia e gera o mapa astral. Retorna metadados e IDs para download.
- **Headers**: `Content-Type: application/json`
- **Body**:

```json
{
  "name": "Maria Silva",
  "birthDate": "1990-05-20",
  "birthTime": "14:30",
  "birthCity": "São Paulo",
  "timezone": "America/Sao_Paulo",
  "latitude": -23.55,
  "longitude": -46.63
}
```

- **Respostas**:
  - 200:

  ```json
  {
    "success": true,
    "chart": {
      "id": "<uuid>",
      "birthDataId": "<uuid>",
      "svgData": "<svg...>",
      "chartData": "{...}",
      "sunSign": "Áries",
      "moonSign": "Touro",
      "risingSign": "Gêmeos",
      "createdAt": "2025-01-01T12:00:00.000Z"
    }
  }
  ```

  - 400:

  ```json
  { "success": false, "error": "mensagem de validação" }
  ```

  - 500:

  ```json
  { "success": false, "error": "Erro interno do servidor" }
  ```

2) GET `/api/download-svg/{chartId}`

- **Descrição**: Retorna o SVG do mapa astral.
- **Parâmetros de path**: `chartId: string`
- **Respostas**:
  - 200: `image/svg+xml`
  - 404: `{ "error": "Mapa astral não encontrado" }`
  - 500: `{ "error": "Erro ao baixar SVG" }`

3) GET `/api/download-pdf/{chartId}`

- **Descrição**: Gera e retorna o PDF do mapa astral.
- **Parâmetros de path**: `chartId: string`
- **Respostas**:
  - 200: `application/pdf`
  - 404: `{ "error": "Mapa astral não encontrado" }` ou `{ "error": "Dados de nascimento não encontrados" }`
  - 500: `{ "error": "Erro ao gerar PDF" }`

### Esquemas (resumo)

- `InsertBirthData`:
  - `name` (string, min 2) — obrigatório
  - `birthDate` (string, regex YYYY-MM-DD) — obrigatório
  - `birthTime` (string, regex HH:MM) — obrigatório
  - `birthCity` (string, min 2) — obrigatório
  - `timezone` (string, default `America/Sao_Paulo`)
  - `latitude` (number, opcional)
  - `longitude` (number, opcional)
- `ChartGenerationResponse`:
  - `success` (boolean)
  - `chart` (`AstralChart`)
  - `error` (string)
- `AstralChart`:
  - `id`, `birthDataId`, `svgData`, `chartData`, `sunSign`, `moonSign`, `risingSign`, `createdAt`

### Exemplos

- cURL (gerar):

```bash
curl -X POST http://localhost:5000/api/generate-chart \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Maria Silva",
    "birthDate": "1990-05-20",
    "birthTime": "14:30",
    "birthCity": "São Paulo",
    "timezone": "America/Sao_Paulo"
  }'
```

- Node.js (fetch):

```js
const res = await fetch('http://localhost:5000/api/generate-chart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Maria Silva',
    birthDate: '1990-05-20',
    birthTime: '14:30',
    birthCity: 'São Paulo'
  })
});
const data = await res.json();
```

- Python (requests):

```python
import requests

r = requests.post('http://localhost:5000/api/generate-chart', json={
  'name': 'Maria Silva',
  'birthDate': '1990-05-20',
  'birthTime': '14:30',
  'birthCity': 'São Paulo'
})
r.raise_for_status()
data = r.json()
```

### Validações e Restrições

- Formatos: `birthDate` deve obedecer `YYYY-MM-DD`; `birthTime` deve obedecer `HH:MM`.
- `name` e `birthCity` exigem comprimento mínimo de 2.
- Se `latitude/longitude` não informados, o servidor tenta inferir coordenadas para cidades brasileiras comuns.

### Headers Necessários

- `Content-Type: application/json` para POST `/api/generate-chart`.

### Autenticação

- Endpoints públicos. A chave RapidAPI é usada pelo servidor (variáveis `RAPIDAPI_KEY` ou `ASTROLOGER_API_KEY`).

### Limitações/Restrições

- **Rate limit recomendado**: ≤ 60 req/min por IP (implementar via gateway/CDN).
- **Tamanho máximo de payload**: ≤ 1 MB para POST.
- **Versões**: `v1` (esta). Mudanças serão divulgadas no OpenAPI.
- **Dependências externas**: RapidAPI `astrologer.p.rapidapi.com`.
- **Segurança**: Não exponha a chave RapidAPI no cliente.

### Mudanças Entre Versões

- v1.0.0: versão inicial com três endpoints e documentação.

### Diagrama de Fluxo (Geração de Mapa)

```mermaid
flowchart LR
  A[Cliente: POST /api/generate-chart] --> B[Validação Zod]
  B -- inválido --> E[400: erro de validação]
  B -- válido --> C[Consulta RapidAPI Astrologer]
  C -- falha --> F[500: falha ao gerar mapa]
  C -- sucesso --> D[Gerar SVG + Persistir dados]
  D --> G[200: ChartGenerationResponse]
  G --> H[GET /api/download-svg/{chartId}]
  G --> I[GET /api/download-pdf/{chartId}]
```
