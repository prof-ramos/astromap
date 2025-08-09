// Timezone detection and formatting utilities

export function detectTimezone(): string {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log('Detected timezone:', timezone);
    return timezone;
  } catch (error) {
    console.error('Error detecting timezone:', error);
    return 'America/Sao_Paulo'; // Default to Brazilian timezone
  }
}

export function formatTimezone(timezone: string): string {
  const timezoneMap: Record<string, string> = {
    'America/Sao_Paulo': 'Horário de Brasília (UTC-3)',
    'America/Fortaleza': 'Horário de Brasília (UTC-3)',
    'America/Recife': 'Horário de Brasília (UTC-3)',
    'America/Manaus': 'Horário do Amazonas (UTC-4)',
    'America/Rio_Branco': 'Horário do Acre (UTC-5)',
    'America/Porto_Velho': 'Horário de Rondônia (UTC-4)',
    'America/Boa_Vista': 'Horário de Roraima (UTC-4)',
    'America/Campo_Grande': 'Horário de MS/MT (UTC-4)',
    'America/Cuiaba': 'Horário de MS/MT (UTC-4)',
  };

  return timezoneMap[timezone] || `${timezone} (detectado automaticamente)`;
}

export function getCurrentDateTime() {
  const now = new Date();
  const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const time = now.toTimeString().slice(0, 5); // HH:MM
  
  return { date, time };
}