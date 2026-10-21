import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

# Ensure output directory exists
OUTPUT_DIR = "public/assets/images/packages"
os.makedirs(OUTPUT_DIR, exist_ok=True)

BASE_DIR = "public/assets/images"
SERVICES_DIR = os.path.join(BASE_DIR, "services")

def draw_kolam_corner(draw, x, y, size=36, corner="top_left"):
    gold = (212, 175, 55, 200)
    gold_soft = (245, 218, 122, 140)
    
    if corner == "top_left":
        draw.line([(x, y), (x + size, y)], fill=gold, width=2)
        draw.line([(x, y), (x, y + size)], fill=gold, width=2)
        draw.line([(x + 5, y + 5), (x + size - 8, y + 5)], fill=gold_soft, width=1)
        draw.line([(x + 5, y + 5), (x + 5, y + size - 8)], fill=gold_soft, width=1)
        draw.ellipse([(x + 8, y + 8), (x + 13, y + 13)], fill=gold)
    elif corner == "top_right":
        draw.line([(x, y), (x - size, y)], fill=gold, width=2)
        draw.line([(x, y), (x, y + size)], fill=gold, width=2)
        draw.line([(x - 5, y + 5), (x - size + 8, y + 5)], fill=gold_soft, width=1)
        draw.line([(x - 5, y + 5), (x - 5, y + size - 8)], fill=gold_soft, width=1)
        draw.ellipse([(x - 13, y + 8), (x - 8, y + 13)], fill=gold)
    elif corner == "bottom_left":
        draw.line([(x, y), (x + size, y)], fill=gold, width=2)
        draw.line([(x, y), (x, y - size)], fill=gold, width=2)
        draw.line([(x + 5, y - 5), (x + size - 8, y - 5)], fill=gold_soft, width=1)
        draw.line([(x + 5, y - 5), (x + 5, y - size + 8)], fill=gold_soft, width=1)
        draw.ellipse([(x + 8, y - 13), (x + 13, y - 8)], fill=gold)
    elif corner == "bottom_right":
        draw.line([(x, y), (x - size, y)], fill=gold, width=2)
        draw.line([(x, y), (x, y - size)], fill=gold, width=2)
        draw.line([(x - 5, y - 5), (x - size + 8, y - 5)], fill=gold_soft, width=1)
        draw.line([(x - 5, y - 5), (x - 5, y - size + 8)], fill=gold_soft, width=1)
        draw.ellipse([(x - 13, y - 13), (x - 8, y - 8)], fill=gold)

def create_themed_package_card(
    base_image_path,
    output_filename,
    flip_horizontal=False,
    color_boost=1.12,
    warmth_tint=(30, 8, 4)
):
    width, height = 1200, 800
    
    # 1. Load and resize base image with center crop
    try:
        base = Image.open(base_image_path).convert("RGBA")
    except Exception as e:
        print(f"Failed to open {base_image_path}: {e}")
        base = Image.new("RGBA", (width, height), (54, 11, 19, 255))
        
    if flip_horizontal:
        base = base.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    
    # Aspect fit/crop to 1200x800
    base_ratio = base.width / base.height
    target_ratio = width / height
    
    if base_ratio > target_ratio:
        new_h = height
        new_w = int(height * base_ratio)
    else:
        new_w = width
        new_h = int(width / base_ratio)
        
    resized = base.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Crop to center
    left = (new_w - width) // 2
    top = (new_h - height) // 2
    cropped = resized.crop((left, top, left + width, top + height))
    
    # Enhance richness & warmth
    enhancer = ImageEnhance.Color(cropped)
    cropped = enhancer.enhance(color_boost)
    enhancer = ImageEnhance.Contrast(cropped)
    cropped = enhancer.enhance(1.06)
    
    # 2. Create gradient overlay (Top subtle vignette, bottom deep maroon gradient)
    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    
    # Top bar gradient for top badge contrast
    for y in range(140):
        alpha = int(140 * (1.0 - y / 140))
        overlay_draw.line([(0, y), (width, y)], fill=(16, 2, 4, alpha))
        
    # Bottom deep maroon gradient from y=360 to y=800
    # Provides smooth dark surface for card title and highlight text
    gradient_start = 360
    for y in range(gradient_start, height):
        progress = (y - gradient_start) / (height - gradient_start)
        # Deep maroon (60, 6, 14) to (20, 2, 4)
        r = int(58 * (1 - progress) + 22 * progress)
        g = int(6 * (1 - progress) + 2 * progress)
        b = int(14 * (1 - progress) + 5 * progress)
        alpha = int(245 * (progress ** 0.85))
        overlay_draw.line([(0, y), (width, y)], fill=(r, g, b, alpha))
        
    # Left & Right subtle vignette borders
    for x in range(60):
        alpha = int(75 * (1.0 - x / 60))
        overlay_draw.line([(x, 0), (x, height)], fill=(15, 1, 3, alpha))
        overlay_draw.line([(width - 1 - x, 0), (width - 1 - x, height)], fill=(15, 1, 3, alpha))
        
    # Composite overlay onto cropped image
    composed = Image.alpha_composite(cropped, overlay)
    draw = ImageDraw.Draw(composed)
    
    # 3. Delicate Gold Framed Borders & Kolam Corners
    gold = (212, 175, 55, 190)
    gold_dim = (180, 140, 40, 110)
    margin = 24
    
    # Outer thin border
    draw.rectangle(
        [(margin, margin), (width - margin, height - margin)],
        outline=gold_dim,
        width=1
    )
    # Inner border
    draw.rectangle(
        [(margin + 5, margin + 5), (width - margin - 5, height - margin - 5)],
        outline=(212, 175, 55, 60),
        width=1
    )
    
    # Draw ornate Kolam corner accents
    c_size = 42
    draw_kolam_corner(draw, margin, margin, c_size, "top_left")
    draw_kolam_corner(draw, width - margin, margin, c_size, "top_right")
    draw_kolam_corner(draw, margin, height - margin, c_size, "bottom_left")
    draw_kolam_corner(draw, width - margin, height - margin, c_size, "bottom_right")
    
    # Save optimized JPEG
    final_rgb = composed.convert("RGB")
    out_path = os.path.join(OUTPUT_DIR, output_filename)
    final_rgb.save(out_path, "JPEG", quality=92, optimize=True)
    print(f"Created: {out_path} ({os.path.getsize(out_path)} bytes)")

PACKAGES = [
    {
        "base_image": "public/assets/images/hero-biryani-feast.jpg",
        "output_filename": "pkg-chicken-biryani.jpg",
        "flip_horizontal": False,
        "color_boost": 1.15
    },
    {
        "base_image": "public/assets/images/hero-biryani-feast.jpg",
        "output_filename": "pkg-mutton-biryani.jpg",
        "flip_horizontal": True,
        "color_boost": 1.2
    },
    {
        "base_image": "public/assets/images/services/wedding-catering.jpg",
        "output_filename": "pkg-wedding-royal-175k.jpg",
        "flip_horizontal": False,
        "color_boost": 1.12
    },
    {
        "base_image": "public/assets/images/services/bulk-stalls-catering.jpg",
        "output_filename": "pkg-wedding-flyer-breakdown.jpg",
        "flip_horizontal": False,
        "color_boost": 1.1
    },
    {
        "base_image": "public/assets/images/services/atoz-wedding-service.jpg",
        "output_filename": "pkg-mega-600pax-198k.jpg",
        "flip_horizontal": False,
        "color_boost": 1.15
    },
    {
        "base_image": "public/assets/images/services/engagement-reception.jpg",
        "output_filename": "pkg-reception-services.jpg",
        "flip_horizontal": False,
        "color_boost": 1.12
    },
    {
        "base_image": "public/assets/images/services/family-functions.jpg",
        "output_filename": "pkg-traditional-4tier-leaf.jpg",
        "flip_horizontal": False,
        "color_boost": 1.15
    },
    {
        "base_image": "public/assets/images/hero-catering-bg.jpg",
        "output_filename": "pkg-dinner-299.jpg",
        "flip_horizontal": False,
        "color_boost": 1.12
    },
    {
        "base_image": "public/assets/images/services/housewarming-ceremony.jpg",
        "output_filename": "pkg-tiffen-160.jpg",
        "flip_horizontal": False,
        "color_boost": 1.18
    },
    {
        "base_image": "public/assets/images/services/birthday-catering.jpg",
        "output_filename": "pkg-reception-live-stalls.jpg",
        "flip_horizontal": False,
        "color_boost": 1.12
    },
    {
        "base_image": "public/assets/images/services/temple-annadhanam.jpg",
        "output_filename": "pkg-baby-shower-feasts.jpg",
        "flip_horizontal": False,
        "color_boost": 1.15
    },
    {
        "base_image": "public/assets/images/services/festival-catering.jpg",
        "output_filename": "pkg-raj-banquet-seemantham.jpg",
        "flip_horizontal": False,
        "color_boost": 1.15
    },
    {
        "base_image": "public/assets/images/extracted/leaf_biryani_feast.jpg",
        "output_filename": "pkg-total-or-labour-contract.jpg",
        "flip_horizontal": False,
        "color_boost": 1.15
    },
    {
        "base_image": "public/assets/images/services/ac-wedding-hall.jpg",
        "output_filename": "pkg-tiffin-combos-1-to-9.jpg",
        "flip_horizontal": False,
        "color_boost": 1.12
    },
    {
        "base_image": "public/assets/images/services/atoz-wedding-service.jpg",
        "output_filename": "pkg-2day-wedding-schedule.jpg",
        "flip_horizontal": True,
        "color_boost": 1.15
    }
]

print(f"Generating {len(PACKAGES)} clean themed package card images...")
for p in PACKAGES:
    create_themed_package_card(
        base_image_path=p["base_image"],
        output_filename=p["output_filename"],
        flip_horizontal=p.get("flip_horizontal", False),
        color_boost=p.get("color_boost", 1.12)
    )

print("All 15 themed package images successfully generated!")
