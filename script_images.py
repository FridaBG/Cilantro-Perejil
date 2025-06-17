import os
import asyncio
import requests
from PIL import Image
from io import BytesIO
from playwright.async_api import async_playwright

CATEGORIAS = ["cilantro", "perejil"]
NUM_IMAGENES = 50
CARPETA_BASE = "imagenes"

async def obtener_urls_google(playwright, categoria, max_urls):
    browser = await playwright.chromium.launch(headless=False)  # Not headless
    context = await browser.new_context(
        user_agent=(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/114.0.0.0 Safari/537.36"
        ),
        viewport={"width": 1280, "height": 800}
    )
    page = await context.new_page()
    await page.goto(f"https://www.google.com/search?q={categoria}&tbm=isch", timeout=60000)

    await page.wait_for_timeout(3000)  # Espera inicial
    await page.mouse.wheel(0, 2000)
    await page.wait_for_timeout(2000)

    await page.wait_for_selector("img.Q4LuWd", timeout=10000)
    urls = set()

    miniaturas = await page.query_selector_all("img.Q4LuWd")
    print(f"[INFO] Se encontraron {len(miniaturas)} miniaturas, extrayendo URLs...")

    for i, img in enumerate(miniaturas):
        if len(urls) >= max_urls:
            break
        try:
            await img.scroll_into_view_if_needed()
            await img.click(timeout=3000)
            await page.wait_for_timeout(1000)
            imagenes = await page.query_selector_all("img.n3VNCb")
            for imagen in imagenes:
                src = await imagen.get_attribute("src")
                if src and "http" in src and not src.startswith("data:"):
                    urls.add(src)
                    break
        except Exception as e:
            print(f"[WARN] Fallo al intentar expandir imagen {i}: {e}")
            continue

    await browser.close()
    return list(urls)

def guardar_imagen(url, carpeta, index):
    try:
        response = requests.get(url, timeout=10)
        img = Image.open(BytesIO(response.content)).convert("RGB")
        path = os.path.join(carpeta, f"{index:03}.jpg")
        img.save(path, "JPEG")
    except Exception as e:
        print(f"[ERROR] Falló {url}: {e}")

async def main():
    os.makedirs(CARPETA_BASE, exist_ok=True)
    async with async_playwright() as p:
        for categoria in CATEGORIAS:
            print(f"[INFO] Buscando '{categoria}' en Google Imágenes")
            urls = await obtener_urls_google(p, categoria, NUM_IMAGENES)
            carpeta = os.path.join(CARPETA_BASE, categoria)
            os.makedirs(carpeta, exist_ok=True)
            print(f"[INFO] Descargando {len(urls)} imágenes para '{categoria}'...")
            for i, url in enumerate(urls):
                guardar_imagen(url, carpeta, i)
    print("[✅] Descarga completada.")

if __name__ == "__main__":
    asyncio.run(main())
