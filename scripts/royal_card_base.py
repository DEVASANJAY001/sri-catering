import os
from PIL import Image, ImageDraw, ImageFont

LOGO_PATH = r'c:\Users\devas\projects\sricatering\images\WhatsApp Image 2026-10-07 at 9.29.05 PM.jpeg'

def get_fonts():
    font_path = r'C:\Windows\Fonts\Nirmala.ttc'
    serif_bold = r'C:\Windows\Fonts\georgiab.ttf'
    serif_reg = r'C:\Windows\Fonts\georgia.ttf'
    
    return {
        'brand_title': ImageFont.truetype(serif_bold, 44),
        'brand_sub': ImageFont.truetype(font_path, 19, index=1),
        'brand_phone': ImageFont.truetype(font_path, 17, index=1),
        'card_title_en': ImageFont.truetype(serif_bold, 28),
        'card_title_ta': ImageFont.truetype(font_path, 23, index=1),
        'col_title': ImageFont.truetype(font_path, 21, index=1),
        'sec_title': ImageFont.truetype(font_path, 17, index=1),
        'body_bold': ImageFont.truetype(font_path, 16, index=1),
        'body_reg': ImageFont.truetype(font_path, 16, index=0),
        'body_small': ImageFont.truetype(font_path, 14, index=0),
        'body_small_bold': ImageFont.truetype(font_path, 14, index=1),
        'badge': ImageFont.truetype(font_path, 15, index=1)
    }

def wrap_text(text, font, max_width, draw):
    words = text.split(' ')
    lines = []
    current_line = []
    for word in words:
        test_line = ' '.join(current_line + [word])
        bbox = draw.textbbox((0, 0), test_line, font=font)
        if (bbox[2] - bbox[0]) <= max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(' '.join(current_line))
            current_line = [word]
    if current_line:
        lines.append(' '.join(current_line))
    return lines

def draw_bullet_item(draw, x, y, text, font, fill_color, max_width, bullet_color=(180, 83, 9)):
    lines = wrap_text(text, font, max_width - 24, draw)
    # Draw bullet at first line
    draw.ellipse([x, y + 4, x + 8, y + 12], fill=bullet_color)
    cur_y = y
    for line in lines:
        draw.text((x + 16, cur_y), line, font=font, fill=fill_color)
        cur_y += 22
    return cur_y + 4

def draw_ornate_border(draw, width, height):
    # Outer Maroon border (14px)
    draw.rectangle([0, 0, width, height], outline=(69, 10, 10), width=14)
    # Inner Gold border (3px)
    draw.rectangle([18, 18, width-18, height-18], outline=(212, 175, 55), width=3)
    # Thin inner gold accent (1px)
    draw.rectangle([24, 24, width-24, height-24], outline=(245, 158, 11), width=1)
    
    # Corner Kolam / Temple Corner Accents
    corners = [(24, 24), (width-24, 24), (24, height-24), (width-24, height-24)]
    for cx, cy in corners:
        draw.ellipse([cx-12, cy-12, cx+12, cy+12], outline=(212, 175, 55), width=2)
        draw.ellipse([cx-5, cy-5, cx+5, cy+5], fill=(212, 175, 55))

def draw_header(img, draw, width, fonts, en_title, ta_title, price_tag=None):
    # Deep maroon header block
    draw.rectangle([24, 24, width-24, 195], fill=(69, 10, 10))
    # Gold decorative bottom bar of header
    draw.rectangle([24, 190, width-24, 196], fill=(212, 175, 55))
    
    # Try placing the Sri Caterers circular logo emblem on the left
    try:
        if os.path.exists(LOGO_PATH):
            logo_img = Image.open(LOGO_PATH).convert('RGB')
            logo_img = logo_img.resize((130, 130), Image.Resampling.LANCZOS)
            # Create circular mask
            mask = Image.new('L', (130, 130), 0)
            mdraw = ImageDraw.Draw(mask)
            mdraw.ellipse([0, 0, 130, 130], fill=255)
            
            # Gold circle background behind logo
            draw.ellipse([50, 42, 50+134, 42+134], fill=(212, 175, 55))
            img.paste(logo_img, (52, 44), mask)
    except Exception as e:
        print("Logo paste exception:", e)
    
    # Brand Name (centered in remaining space)
    content_x = 210
    brand_text = "SRI CATERERS"
    draw.text((content_x, 42), brand_text, font=fonts['brand_title'], fill=(254, 240, 138))
    
    # Subtitle
    sub_text = "THE EVENT MANAGEMENT COMPANY • CHENNAI"
    draw.text((content_x, 95), sub_text, font=fonts['brand_sub'], fill=(255, 255, 255))
    
    # Contact & Quality pill
    pill_text = "Phone: 86081 88101  •  Villivakkam & Perambur  •  Authentic Tamil Hospitality"
    draw.text((content_x, 130), pill_text, font=fonts['brand_phone'], fill=(251, 191, 36))
    
    # Halal / Pure Veg stamp on top right
    draw.rounded_rectangle([width-240, 46, width-50, 106], radius=12, fill=(127, 29, 29), outline=(212, 175, 55), width=2)
    draw.text((width-226, 54), "100% QUALITY", font=fonts['brand_phone'], fill=(254, 240, 138))
    draw.text((width-226, 78), "TASTE & HYGIENE", font=fonts['body_small_bold'], fill=(255, 255, 255))
    
    # Category / Title Plaque (below header)
    draw.rounded_rectangle([50, 215, width-50, 305], radius=16, fill=(255, 255, 255), outline=(212, 175, 55), width=2)
    
    # English title
    tbox = draw.textbbox((0, 0), en_title, font=fonts['card_title_en'])
    tx = (width - (tbox[2] - tbox[0])) // 2
    draw.text((tx, 226), en_title, font=fonts['card_title_en'], fill=(69, 10, 10))
    
    # Tamil title
    if ta_title:
        ttbox = draw.textbbox((0, 0), ta_title, font=fonts['card_title_ta'])
        ttx = (width - (ttbox[2] - ttbox[0])) // 2
        draw.text((ttx, 264), ta_title, font=fonts['card_title_ta'], fill=(180, 83, 9))

def draw_footer(draw, width, height, fonts):
    draw.rectangle([24, height-84, width-24, height-24], fill=(69, 10, 10))
    draw.rectangle([24, height-86, width-24, height-84], fill=(212, 175, 55))
    
    f1 = "Pure Vegetarian & 100% Halal Non-Veg • Fresh Plantain Leaf & Buffet Catering"
    f2 = "Bookings & Inquiries: 86081 88101  |  Email: sricateres001@gmail.com"
    
    b1 = draw.textbbox((0, 0), f1, font=fonts['sec_title'])
    draw.text(((width - (b1[2] - b1[0])) // 2, height-74), f1, font=fonts['sec_title'], fill=(254, 240, 138))
    
    b2 = draw.textbbox((0, 0), f2, font=fonts['body_small'])
    draw.text(((width - (b2[2] - b2[0])) // 2, height-46), f2, font=fonts['body_small'], fill=(255, 255, 255))
