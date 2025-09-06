import proj4 from 'proj4';

export interface TMCoord {
  tmX: number;
  tmY: number;
}

// Define Korea 2000 / Central Belt 2010 (EPSG:5186)
// 중부원점: lon_0=127, lat_0=38, GRS80
proj4.defs(
  'EPSG:5186',
  '+proj=tmerc +lat_0=38 +lon_0=127 +k=0.9996 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs'
);

// Convert WGS84 (lat, lng) to TM coordinates locally (no external API)
export async function toTMCoord(lat: number, lng: number): Promise<TMCoord> {
  const [x, y] = proj4(proj4.WGS84, 'EPSG:5186', [lng, lat]);
  return { tmX: x, tmY: y } satisfies TMCoord;
}
