from PIL import Image

files = [
    r"C:\Users\diran\OneDrive\Desktop\CICS_Clearance System\frontend\public\cics-logo.png",
    r"C:\Users\diran\OneDrive\Desktop\CICS_Clearance System\frontend\public\msu-seal.png",
]

threshold = 220

for src in files:
    img = Image.open(src).convert("RGBA")
    pixels = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if r >= threshold and g >= threshold and b >= threshold:
                pixels[x, y] = (r, g, b, 0)
    img.save(src, "PNG")
    print(f"Saved: {src} ({w}x{h})")
