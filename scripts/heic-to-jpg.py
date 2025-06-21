import os
from PIL import Image
import pillow_heif

# Carpeta raíz donde están las subcarpetas
root_folder = "images"

def convert_and_replace_heic(folder):
    for subdir, _, files in os.walk(folder):
        for file in files:
            if file.lower().endswith('.heic'):
                heic_path = os.path.join(subdir, file)
                jpg_path = os.path.splitext(heic_path)[0] + ".jpg"

                try:
                    # Leer y convertir
                    heif_file = pillow_heif.read_heif(heic_path)
                    image = Image.frombytes(
                        heif_file.mode,
                        heif_file.size,
                        heif_file.data,
                        "raw"
                    )
                    image.save(jpg_path, format="JPEG")
                    print(f"✅ Convertido: {heic_path} → {jpg_path}")

                    # Eliminar el .heic original
                    os.remove(heic_path)
                    print(f"🗑️ Eliminado: {heic_path}")
                except Exception as e:
                    print(f"❌ Error con {heic_path}: {e}")

if __name__ == "__main__":
    convert_and_replace_heic(root_folder)
