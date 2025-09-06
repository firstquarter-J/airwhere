export interface AirQualityReading {
  stationName: string;
  dataTime: string;
  pm10: { value: number | null; grade: number | null };
  pm25: { value: number | null; grade: number | null };
  khai?: { value: number | null; grade: number | null };
}

const DEFAULT_FETCH_TIMEOUT_MS = 8000;
async function fetchWithTimeout(
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1],
  timeoutMs = DEFAULT_FETCH_TIMEOUT_MS
) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: ac.signal });
  } finally {
    clearTimeout(t);
  }
}

// Find nearest measurement station using TM coordinates
async function getNearestStationName(
  tmX: number,
  tmY: number,
  apiKey: string
): Promise<string | null> {
  const params = new URLSearchParams({
    serviceKey: apiKey,
    returnType: 'json',
    tmX: String(tmX),
    tmY: String(tmY),
  });

  const url = `https://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList?${params.toString()}`;
  const res = await fetchWithTimeout(url);
  const text = await res.text();
  let json: any;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    const message = json?.response?.header?.resultMsg || res.statusText || 'Nearby station request failed';
    throw new Error(message);
  }

  const items = json?.response?.body?.items;
  if (!Array.isArray(items) || items.length === 0) return null;
  return items[0]?.stationName ?? null;
}

// Get real-time measurements for a station
async function getRealtimeByStation(
  stationName: string,
  apiKey: string
): Promise<AirQualityReading | null> {
  const params = new URLSearchParams({
    serviceKey: apiKey,
    returnType: 'json',
    stationName,
    dataTerm: 'DAILY',
    ver: '1.3',
  });

  const url = `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?${params.toString()}`;
  const res = await fetchWithTimeout(url);
  const text = await res.text();
  let json: any;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    const message = json?.response?.header?.resultMsg || res.statusText || 'Realtime measure request failed';
    throw new Error(message);
  }

  const item = json?.response?.body?.items?.[0];
  if (!item) return null;

  const toNum = (v: any): number | null => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  return {
    stationName: item.stationName ?? stationName,
    dataTime: item.dataTime,
    pm10: { value: toNum(item.pm10Value), grade: toNum(item.pm10Grade) },
    pm25: { value: toNum(item.pm25Value), grade: toNum(item.pm25Grade) },
    khai: { value: toNum(item.khaiValue), grade: toNum(item.khaiGrade) },
  } satisfies AirQualityReading;
}

export async function getAirQualityByTM(
  tmX: number,
  tmY: number,
  apiKey: string
): Promise<AirQualityReading | null> {
  const stationName = await getNearestStationName(tmX, tmY, apiKey);
  if (!stationName) return null;
  return getRealtimeByStation(stationName, apiKey);
}

// Fallback: get first available station reading within a province (sido)
export async function getAirQualityBySido(
  sidoName: string,
  apiKey: string
): Promise<AirQualityReading | null> {
  const params = new URLSearchParams({
    serviceKey: apiKey,
    returnType: 'json',
    sidoName,
    numOfRows: '100',
    pageNo: '1',
    ver: '1.3',
  });

  const url = `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?${params.toString()}`;
  const res = await fetchWithTimeout(url);
  const text = await res.text();
  let json: any;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    const message = json?.response?.header?.resultMsg || res.statusText || 'Sido realtime request failed';
    throw new Error(message);
  }

  const item = json?.response?.body?.items?.[0];
  if (!item) return null;

  const toNum = (v: any): number | null => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  return {
    stationName: item.stationName,
    dataTime: item.dataTime,
    pm10: { value: toNum(item.pm10Value), grade: toNum(item.pm10Grade) },
    pm25: { value: toNum(item.pm25Value), grade: toNum(item.pm25Grade) },
    khai: { value: toNum(item.khaiValue), grade: toNum(item.khaiGrade) },
  } satisfies AirQualityReading;
}
