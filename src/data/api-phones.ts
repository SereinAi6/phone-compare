/**
 * Phone data sourced from phones_data_20250729_181901.json
 * Rich spec data with detailed hardware info, no runtime API calls needed.
 */

import rawData from "./phones_data_20250729_181901.json";

export interface RawPhone {
  brand: string;
  model: string;
  device_type: string | null;
  release_date: string | null;
  status: string | null;
  price_official: string | null;
  price_unofficial: string | null;
  price_variants: string | null;
  price_updated: string | null;
  operating_system: string | null;
  os_version: string | null;
  user_interface: string | null;
  chipset: string | null;
  cpu: string | null;
  cpu_cores: string | null;
  fabrication: string | null;
  gpu: string | null;
  display_type: string | null;
  screen_size: string | null;
  resolution: string | null;
  aspect_ratio: string | null;
  pixel_density: string | null;
  screen_to_body_ratio: string | null;
  screen_protection: string | null;
  brightness: string | null;
  refresh_rate: string | null;
  primary_camera_resolution: string | null;
  primary_camera_video_recording: string | null;
  selfie_camera_resolution: string | null;
  height: string | null;
  width: string | null;
  thickness: string | null;
  weight: string | null;
  colors: string | null;
  waterproof: string | null;
  ip_rating: string | null;
  battery_capacity: string | null;
  quick_charging: string | null;
  internal_storage: string | null;
  storage_type: string | null;
  ram: string | null;
  ram_type: string | null;
  network: string | null;
  sim_slot: string | null;
  wlan: string | null;
  bluetooth: string | null;
  gps: string | null;
  sensors: string | null;
  audio_jack: string | null;
  image_url: string | null;
  detail_url: string | null;
  [key: string]: unknown;
}

export interface ApiPhone {
  brand: string;
  phone_name: string;
  slug: string;
  image: string;
  detail: string;
  specs: RawPhone;
}

export interface ApiBrand {
  brand_name: string;
  brand_slug: string;
  device_count: number;
}

export interface BrandWithPhones {
  brand: ApiBrand;
  phones: ApiPhone[];
}

/** Hot brands shown first, in this order */
const HOT_BRANDS = [
  "Apple", "Samsung", "Xiaomi", "Huawei", "OnePlus",
  "Oppo", "Vivo", "Realme", "Honor", "Google",
  "Sony", "Motorola", "Nokia", "Tecno", "Infinix",
];

// ── Helpers ──

function slugify(brand: string, model: string): string {
  return `${brand}_${model}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function parseReleaseDate(s: string | null): number {
  if (!s) return 0;
  // Handle format like "25 July 2025"
  const d = new Date(s);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

// ── Build data ──

const allDevices: ApiPhone[] = (rawData as RawPhone[]).map((d) => ({
  brand: d.brand || "Unknown",
  phone_name: d.model || "Unknown",
  slug: slugify(d.brand || "", d.model || ""),
  image: d.image_url || "",
  detail: d.detail_url || "",
  specs: d,
}));

// Sort all devices by release_date descending (newest first)
allDevices.sort((a, b) => parseReleaseDate(b.specs.release_date) - parseReleaseDate(a.specs.release_date));

// Group by brand (phones within each brand already sorted by price_updated)
const _phonesByBrand: Record<string, ApiPhone[]> = {};
for (const phone of allDevices) {
  const b = phone.brand;
  if (!_phonesByBrand[b]) _phonesByBrand[b] = [];
  _phonesByBrand[b].push(phone);
}

// Build brands list, hot brands first then rest alphabetically
const _allBrands: ApiBrand[] = Object.entries(_phonesByBrand)
  .map(([name, phones]) => ({
    brand_name: name,
    brand_slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    device_count: phones.length,
  }))
  .sort((a, b) => {
    const ai = HOT_BRANDS.findIndex((h) => h.toLowerCase() === a.brand_name.toLowerCase());
    const bi = HOT_BRANDS.findIndex((h) => h.toLowerCase() === b.brand_name.toLowerCase());
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.brand_name.localeCompare(b.brand_name);
  });

// ── Public API ──

export const allBrands: ApiBrand[] = _allBrands;
export const phonesByBrand: Record<string, ApiPhone[]> = _phonesByBrand;

export function getAllPhones(): ApiPhone[] {
  return allDevices;
}

export function getBrandsWithPhones(): BrandWithPhones[] {
  return _allBrands
    .map((brand) => {
      const phones = _phonesByBrand[brand.brand_name] || [];
      if (phones.length === 0) return null;
      return { brand, phones };
    })
    .filter((x): x is BrandWithPhones => x !== null);
}

export function getPhonesByBrand(brandName: string): ApiPhone[] {
  return _phonesByBrand[brandName] || [];
}

export function getTotalPhoneCount(): number {
  return allDevices.length;
}

export function getPhoneBySlug(slug: string): ApiPhone | undefined {
  return allDevices.find((p) => p.slug === slug);
}

export function searchPhones(query: string): ApiPhone[] {
  const q = query.toLowerCase();
  return allDevices.filter(
    (p) =>
      p.phone_name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
  );
}
