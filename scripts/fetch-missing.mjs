/**
 * Retry fetching missing/incomplete brands with longer delays
 */
import fs from "fs";
import path from "path";

const API_BASE = "https://phone-specs-api.vercel.app";
const dataDir = path.join(import.meta.dirname, "..", "src", "data");

const MISSING_BRANDS = [
  { brand_name: "Xiaomi", brand_slug: "xiaomi-phones-80" },
  { brand_name: "vivo", brand_slug: "vivo-phones-98" },
  { brand_name: "Samsung", brand_slug: "samsung-phones-9" },
];

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchPhonesForBrand(brandSlug, brandName) {
  const allPhones = [];
  let page = 1;
  let lastPage = 1;

  while (page <= lastPage) {
    console.log(`  Fetching ${brandName} page ${page}/${lastPage}...`);
    let retries = 3;
    while (retries > 0) {
      try {
        const data = await fetchJSON(`${API_BASE}/brands/${brandSlug}?page=${page}`);
        if (!data.status) {
          console.warn(`  Warning: API returned false status for page ${page}`);
          if (data.error && data.error.includes("429")) {
            console.log(`  Rate limited, waiting 60s...`);
            await sleep(60000);
            retries--;
            continue;
          }
          break;
        }
        lastPage = data.data.last_page || 1;
        const phones = data.data.phones || [];
        allPhones.push(...phones);
        break;
      } catch (err) {
        console.warn(`  Error: ${err.message}, retries left: ${retries - 1}`);
        if (err.message.includes("429")) {
          console.log(`  Rate limited, waiting 60s...`);
          await sleep(60000);
        }
        retries--;
        if (retries === 0) {
          console.warn(`  Giving up on page ${page}`);
        }
      }
    }
    page++;
    await sleep(2000); // longer delay between pages
  }

  return allPhones;
}

async function main() {
  // Load existing data
  const existing = JSON.parse(fs.readFileSync(path.join(dataDir, "phones-api.json"), "utf-8"));

  for (const brand of MISSING_BRANDS) {
    const existingCount = (existing[brand.brand_name] || []).length;
    console.log(`\n${brand.brand_name}: currently have ${existingCount} phones`);

    // Skip Samsung if we already have a decent amount
    if (brand.brand_name === "Samsung" && existingCount >= 400) {
      console.log("  Samsung has enough, skipping");
      continue;
    }

    console.log(`Fetching ${brand.brand_name}...`);
    await sleep(5000); // initial delay

    const phones = await fetchPhonesForBrand(brand.brand_slug, brand.brand_name);
    if (phones.length > existingCount) {
      existing[brand.brand_name] = phones.map(p => ({
        brand: (p.brand || brand.brand_name).trim(),
        phone_name: p.phone_name,
        slug: p.slug,
        image: p.image,
        detail: p.detail,
      }));
      console.log(`  Updated ${brand.brand_name}: ${phones.length} phones`);
    } else {
      console.log(`  No improvement (got ${phones.length}), keeping existing`);
    }

    await sleep(5000);
  }

  fs.writeFileSync(
    path.join(dataDir, "phones-api.json"),
    JSON.stringify(existing, null, 2)
  );

  const totalPhones = Object.values(existing).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`\nDone! Total: ${totalPhones} phones across ${Object.keys(existing).length} brands`);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
