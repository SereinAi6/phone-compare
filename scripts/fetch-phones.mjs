/**
 * Fetch all brands and phone models from phone-specs-api
 * and save them to src/data/
 */

const API_BASE = "https://phone-specs-api.vercel.app";

// Major brands we care about for the comparison tool
const TARGET_BRANDS = [
  "Apple", "Samsung", "Google", "Xiaomi", "OnePlus",
  "Huawei", "Sony", "vivo", "Oppo", "Honor",
  "Realme", "Nothing", "Motorola", "Nokia", "Asus"
];

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAllBrands() {
  console.log("Fetching brands list...");
  const data = await fetchJSON(`${API_BASE}/brands`);
  if (!data.status) throw new Error("Failed to fetch brands");
  return data.data;
}

async function fetchPhonesForBrand(brandSlug, brandName) {
  const allPhones = [];
  let page = 1;
  let lastPage = 1;

  while (page <= lastPage) {
    console.log(`  Fetching ${brandName} page ${page}/${lastPage}...`);
    try {
      const data = await fetchJSON(`${API_BASE}/brands/${brandSlug}?page=${page}`);
      if (!data.status) {
        console.warn(`  Warning: Failed page ${page} for ${brandName}`);
        break;
      }
      lastPage = data.data.last_page || 1;
      const phones = data.data.phones || [];
      allPhones.push(...phones);
    } catch (err) {
      console.warn(`  Error fetching page ${page} for ${brandName}: ${err.message}`);
      break;
    }
    page++;
    await sleep(300); // rate limit
  }

  return allPhones;
}

async function main() {
  const allBrands = await fetchAllBrands();

  // Save full brands list
  const brandsOutput = allBrands.map(b => ({
    brand_name: b.brand_name,
    brand_slug: b.brand_slug,
    device_count: b.device_count,
    detail: b.detail,
  }));

  const fs = await import("fs");
  const path = await import("path");
  const dataDir = path.join(import.meta.dirname, "..", "src", "data");

  fs.writeFileSync(
    path.join(dataDir, "brands-api.json"),
    JSON.stringify(brandsOutput, null, 2)
  );
  console.log(`Saved ${brandsOutput.length} brands to brands-api.json`);

  // Fetch phones for target brands only
  const targetBrandSlugs = allBrands.filter(b =>
    TARGET_BRANDS.some(t => t.toLowerCase() === b.brand_name.toLowerCase())
  );

  console.log(`\nFetching phones for ${targetBrandSlugs.length} target brands...`);

  const allPhonesByBrand = {};

  for (const brand of targetBrandSlugs) {
    console.log(`\nFetching ${brand.brand_name} (${brand.device_count} devices)...`);
    const phones = await fetchPhonesForBrand(brand.brand_slug, brand.brand_name);
    allPhonesByBrand[brand.brand_name] = phones.map(p => ({
      brand: (p.brand || brand.brand_name).trim(),
      phone_name: p.phone_name,
      slug: p.slug,
      image: p.image,
      detail: p.detail,
    }));
    console.log(`  Got ${allPhonesByBrand[brand.brand_name].length} phones for ${brand.brand_name}`);
    await sleep(500);
  }

  // Save all phones by brand
  fs.writeFileSync(
    path.join(dataDir, "phones-api.json"),
    JSON.stringify(allPhonesByBrand, null, 2)
  );

  // Count totals
  const totalPhones = Object.values(allPhonesByBrand).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`\nDone! Saved ${totalPhones} phones across ${Object.keys(allPhonesByBrand).length} brands to phones-api.json`);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
