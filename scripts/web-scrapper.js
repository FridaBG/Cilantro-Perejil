const { chromium } = require("playwright");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

const IMAGES_PER_CARD = 500;
const BATCH_SIZE = 50;

const items = [
  "hoja de cilantro HD fondo blanco",
  "coriander leaf HD isolated white background",
  "coriandrum sativum leaf HD isolated white background",
  "hoja de perejil HD fondo blanco",
  "parsley leaf HD isolated white background",
  "petroselinum crispum leaf HD isolated white background",
];

const METADATA_DIR = path.join(__dirname, "metadata");
fs.ensureDirSync(METADATA_DIR);

const downloadImage = async (url, folder, index) => {
  try {
    const ext =
      path.extname(new URL(url).pathname).split("?")[0] ||
      (url.includes(".png") ? ".png" : ".jpg");
    const filePath = path.join(folder, `${index}${ext}`);
    const writer = fs.createWriteStream(filePath);

    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
      timeout: 10000,
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (err) {
    console.warn(`Error con URL: ${url} – ${err.message}`);
  }
};

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1600, height: 1400 });

  for (const item of items) {
    const folder = path.join(__dirname, "dataset", item);
    await fs.ensureDir(folder);

    const metadataPath = path.join(METADATA_DIR, `${item}.json`);
    let metadata = [];
    let downloadedUrls = new Set();

    if (await fs.pathExists(metadataPath)) {
      metadata = await fs.readJSON(metadataPath);
      downloadedUrls = new Set(metadata.map((m) => m.url));
    }

    console.log(`🔍 Buscando imágenes para: ${item}`);

    const query = encodeURIComponent(`${item}`);
    const url = `https://www.google.com/search?tbm=isch&q=${query}`;
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Scroll down to load more images
    for (let i = 0; i < 20; i++) {
      await page.mouse.wheel(0, 1000);
      await page.waitForTimeout(1000);
    }

    const imageUrls = await page.$$eval("img", (imgs) =>
      imgs
        // .filter(
        //   (img) =>
        //     img.src &&
        //     img.src.startsWith("http") &&
        //     img.naturalWidth > 400 && // <-- HIGH QUALITY ONLY
        //     img.naturalHeight > 400 &&
        //     (img.src.endsWith(".jpg") ||
        //       img.src.endsWith(".jpeg") ||
        //       img.src.endsWith(".png"))
        // )
        .map((img) => img.src)
    );

    const uniqueUrls = [...new Set(imageUrls)].slice(0, IMAGES_PER_CARD);
    console.log(`📸 Encontradas ${uniqueUrls.length} imágenes para ${item}`);

    for (let i = 0; i < uniqueUrls.length; i += BATCH_SIZE) {
      const batch = uniqueUrls.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(
        batch.map((url, idx) => downloadImage(url, folder, i + idx + 1))
      );

      for (const result of results) {
        if (result) {
          metadata.push({
            url: result.url,
            filePath: result.filePath,
            item,
            downloadedAt: new Date().toISOString(),
          });
        }
      }

      await fs.writeJSON(metadataPath, metadata, { spaces: 2 });

      console.log(`✅ Descargado batch ${i + 1}–${i + batch.length}`);
    }

    await new Promise((res) => setTimeout(res, 3000)); // pausa entre cartas
  }

  await browser.close();
  console.log("🎉 Todas los items han sido procesadas.");
})();
