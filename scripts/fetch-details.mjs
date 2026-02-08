/**
 * Fetch detail data for brands and phones, replacing the detail URL
 * with the actual API response data (inline).
 *
 * This way the frontend doesn't need to make any API calls at runtime.
 */
import fs from "fs";
import path from "path";

const dataDir = path.join(import.meta.dirname, "..", "src", "data");

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Brands ──────────────────────────────────────────────────────────
async function fetchBrandDetails() {
  const brandsFile = path.join(dataDir, "brands-api.json");
  const brands = JSON.parse(fs.readFileSync(brandsFile, "utf-8"));

  console.log(`\n=== Fetching detail for ${brands.length} brands ===\n`);

  for (let i = 0; i < brands.length; i++) {
    const brand = brands[i];
    // Skip if already fetched (detail is an object, not a string URL)
    if (typeof brand.detail !== "string") {
      console.log(`  [${i + 1}/${brands.length}] ${brand.brand_name} — already has detail data, skipping`);
      continue;
    }

    const url = brand.detail;
    console.log(`  [${i + 1}/${brands.length}] ${brand.brand_name} — ${url}`);

    let retries = 3;
    while (retries > 0) {
      try {
        const resp = await fetchJSON(url);
        // Store the actual response data instead of the URL
        brand.detail = resp.data || resp;
        break;
      } catch (err) {
        retries--;
        console.warn(`    Error: ${err.message} (retries left: ${retries})`);
        if (retries > 0) {
          const wait = err.message.includes("429") ? 30000 : 5000;
          console.log(`    Waiting ${wait / 1000}s...`);
          await sleep(wait);
        } else {
          console.warn(`    Giving up on ${brand.brand_name}, keeping URL`);
        }
      }
    }

    await sleep(500);

    // Save progress every 20 brands
    if ((i + 1) % 20 === 0) {
      fs.writeFileSync(brandsFile, JSON.stringify(brands, null, 2));
      console.log(`  [checkpoint] Saved progress at ${i + 1} brands`);
    }
  }

  fs.writeFileSync(brandsFile, JSON.stringify(brands, null, 2));
  console.log(`\nDone! Saved brands with inline detail data.`);
}

// ── Phones ──────────────────────────────────────────────────────────
async function fetchPhoneDetails() {
  const phonesFile = path.join(dataDir, "phones-api.json");
  const phonesByBrand = JSON.parse(fs.readFileSync(phonesFile, "utf-8"));

  const brandNames = Object.keys(phonesByBrand);
  const totalPhones = Object.values(phonesByBrand).reduce((s, arr) => s + arr.length, 0);
  console.log(`\n=== Fetching detail for ${totalPhones} phones across ${brandNames.length} brands ===\n`);

  let count = 0;

  for (const brandName of brandNames) {
    const phones = phonesByBrand[brandName];
    console.log(`\n── ${brandName} (${phones.length} phones) ──`);

    for (let i = 0; i < phones.length; i++) {
      const phone = phones[i];
      count++;

      // Skip if already fetched
      if (typeof phone.detail !== "string") {
        console.log(`  [${count}/${totalPhones}] ${phone.phone_name} — already has detail data, skipping`);
        continue;
      }

      const url = phone.detail;
      console.log(`  [${count}/${totalPhones}] ${phone.phone_name} — ${url}`);

      let retries = 3;
      while (retries > 0) {
        try {
          const resp = await fetchJSON(url);
          phone.detail = resp.data || resp;
          break;
        } catch (err) {
          retries--;
          console.warn(`    Error: ${err.message} (retries left: ${retries})`);
          if (retries > 0) {
            const wait = err.message.includes("429") ? 30000 : 5000;
            console.log(`    Waiting ${wait / 1000}s...`);
            await sleep(wait);
          } else {
            console.warn(`    Giving up on ${phone.phone_name}, keeping URL`);
          }
        }
      }

      await sleep(500);
    }

    // Save progress after each brand
    fs.writeFileSync(phonesFile, JSON.stringify(phonesByBrand, null, 2));
    console.log(`  [checkpoint] Saved progress after ${brandName}`);
  }

  console.log(`\nDone! Saved phones with inline detail data.`);
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const target = args[0] || "all"; // "brands", "phones", or "all"

  if (target === "brands" || target === "all") {
    await fetchBrandDetails();
  }
  if (target === "phones" || target === "all") {
    await fetchPhoneDetails();
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
