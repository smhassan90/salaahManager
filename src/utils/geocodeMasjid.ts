/**
 * Geocode a masjid address once at save time so the user app never has to.
 */

type AddressParts = {
  name?: string;
  address?: string;
  area?: string;
  location?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
};

function scoreNominatimResult(item: any): number {
  const cls = String(item?.class || '').toLowerCase();
  const typ = String(item?.type || '').toLowerCase();
  if (typ.includes('mosque') || typ.includes('place_of_worship')) {
    return 100;
  }
  if (cls === 'amenity' || cls === 'building' || cls === 'tourism') {
    return 70;
  }
  if (cls === 'boundary') {
    return 0;
  }
  if (
    cls === 'place' &&
    ['city', 'town', 'state', 'country', 'county', 'municipality', 'village'].includes(typ)
  ) {
    return 0;
  }
  return 20;
}

export async function geocodeMasjidAddress(
  masjid: AddressParts,
): Promise<{latitude: number; longitude: number} | null> {
  const parts = [
    masjid.name,
    masjid.address,
    masjid.area,
    masjid.location,
    masjid.city,
    masjid.state,
    masjid.postal_code,
    masjid.country || 'Pakistan',
  ].filter(Boolean);
  const query = [...new Set(parts)].join(', ');
  if (!query) {
    return null;
  }

  try {
    const url =
      'https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&countrycodes=pk&q=' +
      encodeURIComponent(query);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SalaahManager/1.0 (alasrbackend.vercel.app)',
        Accept: 'application/json',
      },
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }
    const ranked = [...data].sort(
      (a, b) => scoreNominatimResult(b) - scoreNominatimResult(a),
    );
    const best = ranked.find(item => scoreNominatimResult(item) > 0) || ranked[0];
    const latitude = parseFloat(best?.lat);
    const longitude = parseFloat(best?.lon);
    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      Math.abs(latitude) > 90 ||
      Math.abs(longitude) > 180
    ) {
      return null;
    }
    return {latitude, longitude};
  } catch {
    return null;
  }
}

export async function withMasjidCoordinates<T extends AddressParts & {
  latitude?: number;
  longitude?: number;
}>(data: T): Promise<T> {
  if (
    typeof data.latitude === 'number' &&
    typeof data.longitude === 'number' &&
    Number.isFinite(data.latitude) &&
    Number.isFinite(data.longitude)
  ) {
    return data;
  }
  const coords = await geocodeMasjidAddress(data);
  if (!coords) {
    return data;
  }
  return {...data, ...coords};
}
