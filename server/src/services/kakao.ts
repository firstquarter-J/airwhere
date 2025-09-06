export interface KakaoAddress {
  sido: string;
  full: string;
  roadAddress: string;
}

export async function reverseGeocode(
  lat: number,
  lng: number,
  apiKey: string
): Promise<KakaoAddress | null> {
  const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`;
  const response = await fetch(url, {
    headers: { Authorization: `KakaoAK ${apiKey}` },
  });

  const text = await response.text();
  let data: any;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const message =
      data?.message || response.statusText || 'Kakao request failed';
    throw new Error(message);
  }

  if (!data.documents || data.documents.length === 0) {
    return null;
  }

  const address = data.documents[0];
  const sido = address.address?.region_1depth_name || '';

  return {
    sido,
    full: address.address?.address_name || '',
    roadAddress: address.road_address?.address_name || '',
  } satisfies KakaoAddress;
}
