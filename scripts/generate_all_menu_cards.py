import os
from PIL import Image, ImageDraw, ImageFont
from royal_card_base import get_fonts, draw_ornate_border, draw_header, draw_footer, wrap_text, draw_bullet_item

OUTPUT_DIR = r'c:\Users\devas\projects\sricatering\public\assets\images\menu-cards'
os.makedirs(OUTPUT_DIR, exist_ok=True)

fonts = get_fonts()

def create_card_canvas(width=1200, height=1850):
    img = Image.new('RGB', (width, height), (255, 253, 248))
    draw = ImageDraw.Draw(img)
    draw_ornate_border(draw, width, height)
    return img, draw

# =========================================================================
# 1. CARD: DINNER ₹299 & TIFFEN ₹160 PER PLATE TARIFF CARD
# =========================================================================
def make_card_dinner299_tiffen160():
    width, height = 1200, 1850
    img, draw = create_card_canvas(width, height)
    draw_header(img, draw, width, fonts, 
                "ROYAL DINNER ₹299 & MUHURTHAM TIFFEN ₹160",
                "பிரமாண்ட 39 வகை ராயல் இரவு விருந்து (₹299/-) • சுப முகூர்த்த டிபன் (₹160/-)")
    
    col_w = (width - 120) // 2
    lx = 50
    rx = lx + col_w + 20
    top_y = 325
    card_h = height - 435
    
    # Left: Dinner 299 Box
    draw.rounded_rectangle([lx, top_y, lx+col_w, top_y+card_h], radius=16, fill=(255, 255, 255), outline=(180, 83, 9), width=2)
    draw.rounded_rectangle([lx, top_y, lx+col_w, top_y+50], radius=14, fill=(69, 10, 10))
    d_title = "ROYAL DINNER — ₹299 / Plate (39 Items)"
    dt_box = draw.textbbox((0, 0), d_title, font=fonts['col_title'])
    draw.text((lx + (col_w - (dt_box[2]-dt_box[0]))//2, top_y+14), d_title, font=fonts['col_title'], fill=(254, 240, 138))
    
    dinner_sections = [
        ("ஸ்வீட்ஸ் & டெசர்ட் (Sweets & Desserts)", [
            "1. ரசமலாய் (Rasamalai)",
            "2. மலாய் ரோல் (Malai Roll)",
            "3. இளநீர் பாயாசம் (Elaneer Payasam)",
            "31. வெண்ணிலா ஐஸ்கிரீம் (Vanilla Ice Cream)",
            "32. ஸ்வீட் பீடா (Sweet Beeda)",
            "33. கட் ஃப்ரூட்ஸ் (Cut Fruits)",
            "34. பாப்கார்ன் (Live Popcorn Counter)",
            "35. பஞ்சுமிட்டாய் (Live Cotton Candy)"
        ]),
        ("ஸ்டார்ட்டர்ஸ் & சூப் (Starters & Soups)", [
            "4. சேனை சாப்ஸ் (Senai Chops)",
            "15. வெஜ் ரோல் (Veg Roll)",
            "16. பர்வீன் பன்னீர் (Parveen Paneer)",
            "17. அமெரிக்கன் மஞ்சூரியன் (Manchurian)",
            "18. உருளை சிப்ஸ் (Potato Chips)",
            "19. வெஜ் நூடுல்ஸ் (Veg Noodles)",
            "20. ஹாட் வெஜ் சூப் (Hot Veg Soup)"
        ]),
        ("ரொட்டி & டிபன் (Breads & Hot Tiffin)", [
            "9. ரோமாலி ரொட்டி (Rumali Roti)",
            "10. பன்னீர் பட்டர் மசாலா (Paneer Butter)",
            "11. மெதுவான இடியாப்பம் (Soft Idiyappam)",
            "12. வெஜ் குருமா (Veg Kuruma)",
            "13. பஞ்சு தட்டு இட்லி (Thattu Idli)",
            "14. ஸ்பைசி வடகறி (Chettinad Vadacurry)"
        ]),
        ("பிரியாணி & இலை சாப்பாடு (Biryani & Meals)", [
            "5. பலாக்காய் தம் பிரியாணி (Palakkai Biryani)",
            "6. தயிர் பச்சடி (Onion Raitha)",
            "7. சாம்பார் சாதம் (Sambar Sadham)",
            "8. தயிர் சாதம் (Creamy Curd Rice)",
            "21. சாதம் (Steamed White Rice)",
            "22. பூண்டு வத்த குழம்பு (Vatha Kuzhambu)",
            "23. பருப்பு ரசம் (Paruppu Rasam)",
            "26. வெஜ் வஞ்சரம் மீன் (Veg Fish)"
        ]),
        ("உபசரிப்பு & சர்வீஸ் (Amenities Included)", [
            "24. மாங்காய் ஊறுகாய் (Pickle)",
            "25. நீட் அப்பளம் (Neat Appalam)",
            "27. வாட்டர் பாட்டில் 300ml (Packaged Water)",
            "28. வாழை இலை (Plantain Leaf)",
            "29. டிகிரி காபி (Filter Coffee)",
            "30. வெல்கம் டிரிங்க் (Welcome Juice)",
            "36. டேபிள் கிளாத் & 37. பேப்பர் ரோல்",
            "38. யூனிபார்ம் சர்வீஸ் பாய்ஸ் (Boys)",
            "39. வெல்கம் GIRLS (2 Hostesses Included!)"
        ])
    ]
    
    cur_y = top_y + 60
    for sec_name, items in dinner_sections:
        draw.rectangle([lx+8, cur_y, lx+col_w-8, cur_y+22], fill=(254, 243, 199))
        draw.text((lx+14, cur_y+2), sec_name, font=fonts['body_small_bold'], fill=(120, 53, 15))
        cur_y += 26
        for it in items:
            draw.text((lx+14, cur_y), it, font=fonts['body_small'], fill=(28, 25, 23))
            cur_y += 20
        cur_y += 6

    # Right: Tiffen 160 Box
    draw.rounded_rectangle([rx, top_y, rx+col_w, top_y+card_h], radius=16, fill=(255, 255, 255), outline=(180, 83, 9), width=2)
    draw.rounded_rectangle([rx, top_y, rx+col_w, top_y+50], radius=14, fill=(69, 10, 10))
    t_title = "MUHURTHAM TIFFEN — ₹160 / Plate"
    tt_box = draw.textbbox((0, 0), t_title, font=fonts['col_title'])
    draw.text((rx + (col_w - (tt_box[2]-tt_box[0]))//2, top_y+14), t_title, font=fonts['col_title'], fill=(254, 240, 138))
    
    tiffen_items = [
        "1. சுத்தமான நெய் கேரட் அல்வா (Ghee Carrot Halwa)",
        "2. மல்லிகைப்பூ தட்டு இட்லி (Melt-in-mouth Thattu Idli)",
        "3. முந்திரி வெண்பொங்கல் (Ghee Ven Pongal with Cashews)",
        "4. மொறுமொறு மெதுவடை (Crispy Medu Vadai)",
        "5. கெட்டி தேங்காய் சட்னி (Fresh Coconut Chutney)",
        "6. காரசார காரச் சட்னி (Spicy Kara Chutney)",
        "7. பாரம்பரிய முருங்கை சாம்பார் (Drumstick Sambar)",
        "8. மெல்லிய இடியாப்பம் (Soft Fluffy Idiyappam)",
        "9. ஸ்பெஷல் வடகறி (Authentic Madras Vadacurry)",
        "10. உப்பலான பூரி (Crispy Puffed Poori)",
        "11. கிழங்கு உருளை மசாலா (Potato Masala Gravy)",
        "12. வாட்டர் பாட்டில் 300ml (300ml Bottled Water)",
        "13. தலைவாழை இலை சர்வீஸ் (Plantain Leaf Service)",
        "14. கும்பகோணம் டிகிரி பில்டர் காபி (Filter Coffee)"
    ]
    
    cur_y = top_y + 70
    draw.rectangle([rx+12, cur_y, rx+col_w-12, cur_y+26], fill=(254, 243, 199))
    draw.text((rx+18, cur_y+3), "சுப முகூர்த்த காலை டிபன் (Muhurtham Tiffen)", font=fonts['sec_title'], fill=(120, 53, 15))
    cur_y += 38
    for it in tiffen_items:
        cur_y = draw_bullet_item(draw, rx+18, cur_y, it, fonts['body_reg'], (28, 25, 23), col_w-36)
        cur_y += 8
        
    cur_y += 14
    draw.rounded_rectangle([rx+14, cur_y, rx+col_w-14, cur_y+240], radius=12, fill=(254, 252, 232), outline=(234, 179, 8), width=1)
    draw.text((rx+26, cur_y+14), "சிறப்பம்சங்கள் (Package Highlights):", font=fonts['sec_title'], fill=(69, 10, 10))
    highlights = [
        "• 100% தூய நெய் மற்றும் தரமான மளிகை பொருட்கள்",
        "• சுத்தமான சீருடை அணிந்த சர்வீஸ் பாய்ஸ்",
        "• நேரடி லைவ் ஸ்டால்கள் (பாப்கார்ன் & பஞ்சுமிட்டாய்)",
        "• வரவேற்பு பெண்கள் (2 Welcome Girls) இலவசம்!",
        "• சென்னை, அம்பத்தூர், ஆவடி, பெரம்பூர் முழுதும் சர்வீஸ்",
        "• இலை விரிப்பு & பேப்பர் ரோல் முழு சர்வீஸ்"
    ]
    hy = cur_y + 45
    for h in highlights:
        draw.text((rx+26, hy), h, font=fonts['body_small_bold'], fill=(22, 101, 52))
        hy += 28

    draw_footer(draw, width, height, fonts)
    img.save(os.path.join(OUTPUT_DIR, 'card-dinner299-tiffen160.jpg'), quality=92)
    print("Saved card-dinner299-tiffen160.jpg")

# =========================================================================
# 2. CARD: TRADITIONAL 4-TIER CATERING MENU CARD
# =========================================================================
def make_card_traditional_4tier():
    width, height = 1200, 1850
    img, draw = create_card_canvas(width, height)
    draw_header(img, draw, width, fonts,
                "TRADITIONAL 4-TIER CATERING TARIFF CARD",
                "பாரம்பரிய 4 அடுக்கு சைவ கேட்டரிங் மெனு கார்டு (காலை • மதியம் • மாலை • இரவு)")
    
    quad_w = (width - 120) // 2
    quad_h = (height - 460) // 2
    
    quads = [
        (50, 330, "BREAKFAST / காலை டிபன்", [
            "காசி அல்வா / கேரட் அல்வா (Pure Ghee)",
            "மெதுவடை / சாம்பார் வடை",
            "வெண்பொங்கல் (நெய், முந்திரி, மிளகு)",
            "மல்லிகைப்பூ இட்லி (2 Nos)",
            "பூரி உருளைக்கிழங்கு மசாலா",
            "மெட்ராஸ் ஸ்பெஷல் வடகறி",
            "முருங்கைக்காய் சாம்பார்",
            "தேங்காய் சட்னி & தக்காளி சட்னி",
            "கும்பகோணம் டிகிரி பில்டர் காபி",
            "வாழை இலை சர்வீஸ் & வாட்டர் பாட்டில்"
        ], "₹160 - ₹180 / Leaf"),
        (50 + quad_w + 20, 330, "LUNCH / மதிய இலை விருந்து", [
            "சிறுபருப்பு பாயாசம் / அடை பாயாசம்",
            "மசால் வடை / வாழைப்பூ வடை",
            "எண்ணெய் கத்திரிக்காய் சாப்ஸ்",
            "உருளைக்கிழங்கு வறுவல் / பொரியல்",
            "சுடச்சுட சாதம் & பருப்பு நெய்",
            "கல்யாண சாம்பார் & தக்காளி ரசம்",
            "பூண்டு வத்தக்குழம்பு",
            "கெட்டி மோர் / தயிர் பச்சடி",
            "சீரக அப்பளம் & மாங்காய் ஊறுகாய்",
            "வாழை இலை & வாட்டர் பாட்டில்"
        ], "₹160 - ₹180 / Leaf"),
        (50, 330 + quad_h + 16, "EVENING SNACKS / மாலை சிற்றுண்டி", [
            "சூடான போண்டா / பஜ்ஜி (200 pax)",
            "வெள்ளை தேங்காய் சட்னி & சாம்பார்",
            "சுண்டல் / மசால் வடை வகைகள்",
            "கும்பகோணம் பில்டர் காபி (150 pax)",
            "மசாலா டீ / சுக்கு மல்லி காபி",
            "வாட்டர்மெலான் ஜூஸ்",
            "வாட்டர் பாட்டில் & டிஷ்யூ பேப்பர்"
        ], "₹160 - ₹180 / Leaf"),
        (50 + quad_w + 20, 330 + quad_h + 16, "DINNER / இரவு விருந்து", [
            "குலோப் ஜாமூன் / காஜுகட்லி / பாதம் அல்வா",
            "ரோமாலி ரொட்டி / சாஃப்ட் சப்பாத்தி",
            "பன்னீர் பட்டர் மசாலா / காளான் குருமா",
            "பலாக்காய் தம் பிரியாணி / வெஜ் பிரியாணி",
            "ஆனியன் ரைத்தா",
            "நேஷனல் பொரியல் & உருளை வறுவல்",
            "சாம்பார் சாதம் & கெட்டி தயிர் சாதம்",
            "அப்பளம் & எலுமிச்சை ஊறுகாய்",
            "ஐஸ்கிரீம் ஸ்கூப் & ஸ்வீட் பீடா",
            "வாட்டர் பாட்டில் & சர்வீஸ் பாய்ஸ்"
        ], "₹280 - ₹290 / Leaf")
    ]
    
    for qx, qy, title, items, tag in quads:
        draw.rounded_rectangle([qx, qy, qx+quad_w, qy+quad_h], radius=14, fill=(255, 255, 255), outline=(180, 83, 9), width=2)
        draw.rounded_rectangle([qx, qy, qx+quad_w, qy+46], radius=12, fill=(69, 10, 10))
        draw.text((qx+16, qy+12), title, font=fonts['col_title'], fill=(254, 240, 138))
        
        draw.rounded_rectangle([qx+quad_w-150, qy+8, qx+quad_w-10, qy+38], radius=8, fill=(217, 119, 6))
        draw.text((qx+quad_w-142, qy+13), tag, font=fonts['badge'], fill=(255, 255, 255))
        
        iy = qy + 58
        for it in items:
            iy = draw_bullet_item(draw, qx+18, iy, it, fonts['body_reg'], (28, 25, 23), quad_w-36)
            iy += 4

    draw_footer(draw, width, height, fonts)
    img.save(os.path.join(OUTPUT_DIR, 'card-traditional-4tier.jpg'), quality=92)
    print("Saved card-traditional-4tier.jpg")

# =========================================================================
# 3. CARD: RECEPTION FEAST & 13 LIVE STALL COUNTERS
# =========================================================================
def make_card_reception_13stalls():
    width, height = 1200, 1850
    img, draw = create_card_canvas(width, height)
    draw_header(img, draw, width, fonts,
                "GRAND RECEPTION FEAST & 13 LIVE COUNTER STALLS",
                "பிரமாண்ட வரவேற்பு விருந்து (21 உணவுகள்) & 13 நேரடி ஸ்டால்கள்")
    
    col_w = (width - 120) // 2
    lx = 50
    rx = lx + col_w + 20
    top_y = 325
    card_h = height - 435
    
    # Left: 21 Reception Courses
    draw.rounded_rectangle([lx, top_y, lx+col_w, top_y+card_h], radius=16, fill=(255, 255, 255), outline=(180, 83, 9), width=2)
    draw.rounded_rectangle([lx, top_y, lx+col_w, top_y+50], radius=14, fill=(69, 10, 10))
    draw.text((lx+18, top_y+14), "21 RECEPTION BANQUET COURSES", font=fonts['col_title'], fill=(254, 240, 138))
    
    items21 = [
        "1. ரசம் மலாய் (Rasamalai)",
        "2. காஜ் பிஸ்தா ரோல் (Kaju Pista Roll)",
        "3. இளநீர் பாயாசம் (Elaneer Payasam)",
        "4. காலி பிளவர் 65 (Crispy Gobi 65)",
        "5. சாஃப்ட் சப்பாத்தி (Soft Chapathi)",
        "6. பன்னீர் பட்டர் மசாலா (Paneer Butter Masala)",
        "7. மினி ஊத்தப்பம் (Mini Uthappam)",
        "8. கார சட்னி (Kara Chutney)",
        "9. தம் பிரியாணி (Aromatic Dum Biryani)",
        "10. ஆனியன் ரைத்தா (Chilled Onion Raitha)",
        "11. சாம்பார் சாதம் (Sambar Sadham)",
        "12. உருளை ஆயில் ரோஸ்ட் (Potato Oil Roast)",
        "13. நேஷனல் பொரியல் (National Poriyal)",
        "14. உருளை சிப்ஸ் (Crispy Potato Chips)",
        "15. அப்பளம் (Appalam)",
        "16. சாதம் (Steamed White Rice)",
        "17. பருப்பு ரசம் (Paruppu Rasam)",
        "18. தயிர் சாதம் (Curd Rice)",
        "19. மாங்காய் தொக்கு (Mango Thokku)",
        "20. மோர் மிளகாய் (Mor Milagai)",
        "21. வாட்டர் பாட்டில் (300ml Bottled Water)"
    ]
    iy = top_y + 64
    for it in items21:
        iy = draw_bullet_item(draw, lx+18, iy, it, fonts['body_reg'], (28, 25, 23), col_w-36)
        iy += 6

    # Right: 13 Live Stalls + Afternoon Lunch
    draw.rounded_rectangle([rx, top_y, rx+col_w, top_y+card_h], radius=16, fill=(255, 255, 255), outline=(180, 83, 9), width=2)
    draw.rounded_rectangle([rx, top_y, rx+col_w, top_y+50], radius=14, fill=(69, 10, 10))
    draw.text((rx+18, top_y+14), "13 LIVE STALLS & AMENITIES", font=fonts['col_title'], fill=(254, 240, 138))
    
    stalls13 = [
        "1. ஃப்ரூட் ஸ்டால் (Fresh Cut Fruit Salad Bar)",
        "2. சுடச்சுட கேரட் அல்வா (Hot Carrot Halwa Counter)",
        "3. வெண்ணிலா ஐஸ்கிரீம் (Vanilla Ice Cream)",
        "4. பட்டர் ஸ்காட்ச் ஐஸ்கிரீம் (Butterscotch Ice Cream)",
        "5. மலை வாழைப்பழம் (Hill Banana)",
        "6. ஸ்வீட் பீடா ஸ்டால் (Sweet Beeda Counter)",
        "7. பாப்கார்ன் மிஷின் (Live Popcorn Machine)",
        "8. பஞ்சுமிட்டாய் மிஷின் (Live Cotton Candy)",
        "9. அலங்கார ஆரத்தி தட்டு (25 Aarathi Thattu)",
        "10. வெஜிடேபிள் கார்விங் கலை (Vegetable Carving)",
        "11. பிரஷ் ஜூஸ் கவுண்டர் (Fresh Fruit Juice)",
        "12. கும்பகோணம் டிகிரி காபி (Filter Coffee)",
        "13. DJ மியூசிக் சிஸ்டம் (Professional DJ & Sound)"
    ]
    iy = top_y + 64
    for it in stalls13:
        iy = draw_bullet_item(draw, rx+18, iy, it, fonts['body_reg'], (28, 25, 23), col_w-36, bullet_color=(22, 101, 52))
        iy += 6

    lunch_y = iy + 14
    draw.rounded_rectangle([rx+14, lunch_y, rx+col_w-14, top_y+card_h-16], radius=12, fill=(254, 243, 199), outline=(217, 119, 6), width=1)
    draw.text((rx+24, lunch_y+12), "மதிய உணவு (Optional Lunch Addon):", font=fonts['sec_title'], fill=(69, 10, 10))
    l_text = "சாதம் • சாம்பார் • ரசம் • பொரியல் • மோர் • அப்பளம் • ஊறுகாய் • பருப்பு பாயாசம் • மசால் வடை • வாட்டர் பாட்டில்"
    lines = wrap_text(l_text, fonts['body_small'], col_w-48, draw)
    ly = lunch_y + 40
    for l in lines:
        draw.text((rx+24, ly), l, font=fonts['body_small'], fill=(120, 53, 15))
        ly += 22
    draw.text((rx+24, ly+4), "முழு சர்வீஸ் பாய்ஸ் & வாழை இலை ஏற்பாடு செய்யப்படுகிறது.", font=fonts['body_small_bold'], fill=(22, 101, 52))

    draw_footer(draw, width, height, fonts)
    img.save(os.path.join(OUTPUT_DIR, 'card-reception-13stalls.jpg'), quality=92)
    print("Saved card-reception-13stalls.jpg")

# =========================================================================
# 4. CARD: 9 CURATED SPECIAL TIFFIN COMBOS
# =========================================================================
def make_card_tiffin_combos_1_9():
    width, height = 1200, 1850
    img, draw = create_card_canvas(width, height)
    draw_header(img, draw, width, fonts,
                "9 CURATED SPECIAL TIFFIN & DINNER COMBOS",
                "ஸ்பெஷல் டிபன் மெனு காம்போக்கள் (மெனு 1 முதல் 9 வரை)")
    
    col_w = (width - 140) // 3
    row_h = (height - 460) // 3
    
    menus = [
        ("மெனு 1 (MENU 1)", [
            "பாதாம் பாசுந்தி",
            "பீஸ் புரோட்டா & குருமா",
            "தயிர் ஆனியன்",
            "மினி பொடி இட்லி (5)",
            "வெஜ் ஊத்தப்பம் (2)",
            "சாம்பார், 2 சட்னி",
            "சூடான பாதாம் பால்"
        ]),
        ("மெனு 2 (MENU 2)", [
            "ஷாய் துக்கடா",
            "ஸ்பிரிங் ரோல்",
            "காளான் ஃப்ரைடு ரைஸ்",
            "ரோமானியன் ரொட்டி",
            "பன்னீர் பட்டர் மசாலா",
            "தட்டு இட்லி & பூண்டு குழம்பு",
            "பூஸ்ட் (Boost)"
        ]),
        ("மெனு 3 (MENU 3)", [
            "குலோப் ஜாமூன்",
            "சில்லி புரோட்டா",
            "சப்பாத்தி (3) & குருமா",
            "இட்லி (2)",
            "சாம்பார், 2 சட்னி",
            "தயிர் சாதம் & ஊறுகாய்",
            "பனங்கற்கண்டு பால்"
        ]),
        ("மெனு 4 (MENU 4)", [
            "ரசமலாய்",
            "இனிப்பு நெய் பணியாரம்",
            "ரங்கூன் அரிசி புட்டு",
            "இடியாப்ப பிரிஞ்சி",
            "புதினா இட்லி & மசால் தோசை",
            "சாம்பார், 2 சட்னி",
            "ஸ்பெஷல் ஜிகர்தண்டா!"
        ]),
        ("மெனு 5 (MENU 5)", [
            "முந்திரி கோதுமை அல்வா",
            "வெஜ் கட்லட்",
            "காளான் பிரியாணி",
            "மினி பன் புரோட்டா & குருமா",
            "இடியாப்பம் நெல்லை சொதி",
            "தயிர் ஆனியன், சட்னி",
            "சூடான மிளகு பால்"
        ]),
        ("மெனு 6 (MENU 6)", [
            "பிஸ்தா ஸ்வீட்ஸ்",
            "பன்னீர் டிக்கா",
            "சில்லி புரோட்டா",
            "காலிபிளவர் குருமா",
            "இட்லி (2) & பெசரட் தோசை",
            "சாம்பார், 2 சட்னி",
            "மசாலா பால்"
        ]),
        ("மெனு 7 (MENU 7)", [
            "கேரட் அல்வா",
            "பேபிகார்ன் 65",
            "கொத்து புரோட்டா",
            "காளான் செமிகிரேவி",
            "ரவா தோசை",
            "பகலா பாத் & ஊறுகாய்",
            "தம் டீ (Dum Tea)"
        ]),
        ("மெனு 8 (MENU 8)", [
            "சம்பா களி",
            "பன்னீர் நூடுல்ஸ்",
            "காளான் மசால் தோசை",
            "மினி சாம்பார் இட்லி",
            "சாம்பார், 2 சட்னி",
            "தக்காளி சாஸ்",
            "கற்கண்டு பால்"
        ]),
        ("மெனு 9 (MENU 9)", [
            "முந்திரி பர்ஃபி",
            "கார பணியாரம்",
            "சேமியா கிச்சடி",
            "மல்லிகைப்பூ இட்லி",
            "நெய் பொடி தோசை",
            "சாம்பார், 2 சட்னி",
            "பில்டர் காபி"
        ])
    ]
    
    idx = 0
    for r in range(3):
        for c in range(3):
            title, items = menus[idx]
            gx = 50 + c * (col_w + 20)
            gy = 330 + r * (row_h + 16)
            
            draw.rounded_rectangle([gx, gy, gx+col_w, gy+row_h], radius=12, fill=(255, 255, 255), outline=(180, 83, 9), width=2)
            draw.rounded_rectangle([gx, gy, gx+col_w, gy+36], radius=10, fill=(69, 10, 10))
            draw.text((gx+12, gy+8), title, font=fonts['col_title'], fill=(254, 240, 138))
            
            iy = gy + 44
            for it in items:
                draw.ellipse([gx+10, iy+4, gx+16, iy+10], fill=(180, 83, 9))
                draw.text((gx+22, iy), it, font=fonts['body_small'], fill=(28, 25, 23))
                iy += 24
            idx += 1

    draw_footer(draw, width, height, fonts)
    img.save(os.path.join(OUTPUT_DIR, 'card-tiffin-combos-1-9.jpg'), quality=92)
    print("Saved card-tiffin-combos-1-9.jpg")

# =========================================================================
# 5. CARD: BABY SHOWER 3-TIER VARIETY RICE FEASTS (Balanced with Service Box)
# =========================================================================
def make_card_baby_shower_variety_rices():
    width, height = 1200, 1850
    img, draw = create_card_canvas(width, height)
    draw_header(img, draw, width, fonts,
                "SEEMANTHAM & VALAKAAPU VARIETY RICE FEASTS",
                "சீமந்தம் & வளைகாப்பு 3 அடுக்கு கலவை சாத விருந்து (மெனு 1, 2, 3)")
    
    col_w = (width - 140) // 3
    top_y = 325
    card_h = 760
    
    menus = [
        ("MENU 1: 5-RICE FEAST", [
            "Sweet (அல்வா / லட்டு)",
            "Curd Vadai (தயிர் வடை)",
            "Pudina Thuvaiyal (துவையல்)",
            "Veg Biryani + Raitha",
            "Bisibelebath (சாம்பார் சாதம்)",
            "Curd Rice (தயிர் சாதம்)",
            "Puli Sadham (புளி சாதம்)",
            "Lemon Sadham (எலுமிச்சை)",
            "Coconut Rice (தேங்காய்)",
            "White Rice & Rasam",
            "Urulai Pattani Varuval",
            "Poriyal & Appalam",
            "Milk Payasam (பாயாசம்)",
            "Pickle & Water 300ml"
        ], "5 Auspicious Rices"),
        ("MENU 2: 7-RICE DELUXE", [
            "Sweet (நெய் இனிப்பு)",
            "Pudina Thuvaiyal",
            "Veg Biryani with Raitha",
            "Puli Sadham (புளி சாதம்)",
            "Lemon Sadham (லெமன்)",
            "Karuveppilai Sadham",
            "Coconut Rice (தேங்காய்)",
            "Beetroot Sadham (பீட்ரூட்)",
            "Mangai Sadham (மாங்காய்)",
            "White Rice, Sambar",
            "Vatha Kuzhambu & Rasam",
            "Urulai Pattani Varuval",
            "Tri-Colour Poriyal & Kootu",
            "Curd Vadai & Appalam",
            "Arasi Payasam & Water"
        ], "7 Auspicious Rices"),
        ("MENU 3: 11-RICE MEGA", [
            "2 Sweets (2 வகை இனிப்பு)",
            "Pudina Thuvaiyal & Vadai",
            "Mushroom Biryani + Raitha",
            "Sambar Sadham & Curd Rice",
            "Puli & Lemon Sadham",
            "Karuveppilai Sadham",
            "Beetroot Sadham",
            "Capsicum Basmati Rice",
            "Gobi Rice & Mangai Rice",
            "Pudina & Carrot Sadham",
            "Karunai Mochai Chops",
            "Beans Usili & Aviyal",
            "Gose Kootu & Appalam",
            "Paruppu Payasam",
            "Pickle & Water Bottle"
        ], "11 Royal Variety Rices")
    ]
    
    for c in range(3):
        title, items, tag = menus[c]
        gx = 50 + c * (col_w + 20)
        draw.rounded_rectangle([gx, top_y, gx+col_w, top_y+card_h], radius=14, fill=(255, 255, 255), outline=(180, 83, 9), width=2)
        draw.rounded_rectangle([gx, top_y, gx+col_w, top_y+50], radius=12, fill=(69, 10, 10))
        draw.text((gx+12, top_y+14), title, font=fonts['col_title'], fill=(254, 240, 138))
        
        draw.rounded_rectangle([gx+14, top_y+58, gx+col_w-14, top_y+84], radius=8, fill=(254, 243, 199))
        draw.text((gx+20, top_y+62), tag, font=fonts['badge'], fill=(180, 83, 9))
        
        iy = top_y + 94
        for it in items:
            iy = draw_bullet_item(draw, gx+14, iy, it, fonts['body_reg'], (28, 25, 23), col_w-28)
            iy += 4

    # Lower Section: Auspicious Seemantham Services & Amenities (Balanced layout)
    lower_y = top_y + card_h + 20
    lower_h = height - lower_y - 105
    draw.rounded_rectangle([50, lower_y, width-50, lower_y+lower_h], radius=16, fill=(254, 252, 232), outline=(212, 175, 55), width=2)
    draw.rounded_rectangle([50, lower_y, width-50, lower_y+46], radius=14, fill=(69, 10, 10))
    draw.text((70, lower_y+12), "சீமந்தம் & வளைகாப்பு சிறப்பு உபசரிப்பு (Auspicious Amenities & Hospitality)", font=fonts['col_title'], fill=(254, 240, 138))
    
    seemantham_amenities = [
        ("மண்பானை இளநீர் பாயாசம் (Clay Pot Elaneer Payasam)", "விருந்தினர்களை கவரும் பாரம்பரிய மண்பானையில் பரிமாறப்படும் பிரத்யேக இளநீர் பாயாசம்."),
        ("சுத்தமான தலைவாழை இலை சர்வீஸ்", "மங்கலகரமான தலைவாழை இலை விரிப்பு மற்றும் சீருடை அணிந்த அனுபவமிக்க சர்வீஸ் பாய்ஸ்."),
        ("தாம்பூல பை & வெல்கம் காபி", "விருந்தினர்களுக்கு தாம்பூல பை மற்றும் கும்பகோணம் டிகிரி பில்டர் காபி கவுண்டர் ஏற்பாடு."),
        ("அனைத்து மண்டபங்களுக்கும் நேரடி சர்வீஸ்", "வில்லிவாக்கம், பெரம்பூர், அண்ணா நகர், அம்பத்தூர், ஆவடி மற்றும் சென்னை முழுவதும் நேரடி சர்வீஸ்.")
    ]
    ay = lower_y + 60
    for name, desc in seemantham_amenities:
        draw.ellipse([70, ay+5, 80, ay+15], fill=(180, 83, 9))
        draw.text((95, ay), name, font=fonts['sec_title'], fill=(69, 10, 10))
        draw.text((95, ay+26), desc, font=fonts['body_reg'], fill=(78, 71, 62))
        ay += 62

    draw_footer(draw, width, height, fonts)
    img.save(os.path.join(OUTPUT_DIR, 'card-baby-shower-variety-rices.jpg'), quality=92)
    print("Saved card-baby-shower-variety-rices.jpg")

# =========================================================================
# 6. CARD: SEEMANTHAM SAAPADU (RAJ BANQUET HALL SPECIAL)
# =========================================================================
def make_card_seemantham_raj_banquet():
    width, height = 1200, 1850
    img, draw = create_card_canvas(width, height)
    draw_header(img, draw, width, fonts,
                "RAJ BANQUET HALL SEEMANTHAM SAAPADU SPECIAL",
                "ராஜ் பேங்க்வட் ஹால் சீமந்த சாப்பாடு ஸ்பெஷல் (மண்பானை இளநீர் பாயாசம்)")
    
    col_w = (width - 120) // 2
    lx = 50
    rx = lx + col_w + 20
    top_y = 325
    card_h = 880
    
    # Left Box
    draw.rounded_rectangle([lx, top_y, lx+col_w, top_y+card_h], radius=16, fill=(255, 255, 255), outline=(180, 83, 9), width=2)
    draw.rounded_rectangle([lx, top_y, lx+col_w, top_y+50], radius=14, fill=(69, 10, 10))
    draw.text((lx+20, top_y+14), "STARTERS, BIRYANI & SWEETS", font=fonts['col_title'], fill=(254, 240, 138))
    
    left_items = [
        ("ஸ்வீட்ஸ் & ஸ்டார்ட்டர்ஸ்", [
            "• மலாய் ரோல் (Malai Roll)",
            "• இளநீர் பாயாசம் - மண்பானையில் (Pot Elaneer Payasam)",
            "• மெதுவான தயிர் வடை (Dahi Vada)",
            "• ஸ்பெஷல் வெஜ் இறா (Crispy Veg Prawn)"
        ]),
        ("டிபன் & பிரியாணி", [
            "• ஸ்டஃப்டு பரோட்டா (Stuffed Parotta)",
            "• கடாய் பன்னீர் (Kadai Paneer Gravy)",
            "• பலாக்காய் தம் பிரியாணி (Palakkai Dum Biryani)",
            "• ஆனியன் தயிர் பச்சடி (Onion Raitha)"
        ]),
        ("சைட் டிஷ் & அப்பளம்", [
            "• பாரம்பரிய கேரளா அவியல் (Kerala Aviyal)",
            "• உருளைக்கிழங்கு வறுவல் (Potato Varuval)",
            "• மொறுமொறு சிப்ஸ் (Crispy Chips)",
            "• அப்பளம் & எலுமிச்சை ஊறுகாய்"
        ])
    ]
    iy = top_y + 66
    for sec, its in left_items:
        draw.rectangle([lx+14, iy, lx+col_w-14, iy+28], fill=(254, 243, 199))
        draw.text((lx+22, iy+4), sec, font=fonts['sec_title'], fill=(180, 83, 9))
        iy += 38
        for it in its:
            draw.text((lx+24, iy), it, font=fonts['body_reg'], fill=(28, 25, 23))
            iy += 34
        iy += 12

    # Right Box
    draw.rounded_rectangle([rx, top_y, rx+col_w, top_y+card_h], radius=16, fill=(255, 255, 255), outline=(180, 83, 9), width=2)
    draw.rounded_rectangle([rx, top_y, rx+col_w, top_y+50], radius=14, fill=(69, 10, 10))
    draw.text((rx+20, top_y+14), "6 VARIETY RICES & DESSERTS", font=fonts['col_title'], fill=(254, 240, 138))
    
    right_items = [
        ("6 வகை கலவை சாதங்கள் (6 Auspicious Rices)", [
            "1. மாங்காய் சாதம் (Seasonal Mango Rice)",
            "2. கோயில் புளி சாதம் (Temple Style Tamarind Rice)",
            "3. கதம்ப சாம்பார் சாதம் (Bisibelebath)",
            "4. கெட்டி தயிர் சாதம் (Creamy Curd Rice)",
            "5. மங்கல தேங்காய் சாதம் (Coconut Rice)",
            "6. மணமணக்கும் ரசம்பாத் (Aromatic Rasambath)"
        ]),
        ("டெசர்ட் & வெல்கம் டிரிங்க்ஸ்", [
            "• கசாட்டா ஐஸ்கிரீம் (Cassata Ice Cream)",
            "• ஸ்வீட் பீடா (Calcutta Sweet Beeda)",
            "• கும்பகோணம் டிகிரி பில்டர் காபி (Degree Coffee)",
            "• மினரல் வாட்டர் பாட்டில் (300ml Bottled Water)",
            "• முழு வாழை இலை & டேபிள் ரோல் சர்வீஸ்"
        ])
    ]
    iy = top_y + 66
    for sec, its in right_items:
        draw.rectangle([rx+14, iy, rx+col_w-14, iy+28], fill=(254, 243, 199))
        draw.text((rx+22, iy+4), sec, font=fonts['sec_title'], fill=(180, 83, 9))
        iy += 38
        for it in its:
            draw.text((rx+24, iy), it, font=fonts['body_reg'], fill=(28, 25, 23))
            iy += 34
        iy += 14

    # Lower Hall Service & Booking Box
    lower_y = top_y + card_h + 24
    lower_h = height - lower_y - 110
    draw.rounded_rectangle([50, lower_y, width-50, lower_y+lower_h], radius=16, fill=(254, 252, 232), outline=(212, 175, 55), width=2)
    draw.rounded_rectangle([50, lower_y, width-50, lower_y+46], radius=14, fill=(69, 10, 10))
    draw.text((70, lower_y+12), "ராஜ் பேங்க்வட் ஹால் நிகழ்வு ஏற்பாடுகள் (Banquet Hall Catering Standards)", font=fonts['col_title'], fill=(254, 240, 138))
    
    b_items = [
        ("தனித்துவமான மண்பானை பரிமாறுதல்", "பாரம்பரிய மண்பானையில் சுடச்சுட இளநீர் பாயாசம் பரிமாறி விருந்தினர்களுக்கு மறக்க முடியாத சுவை அனுபவம்."),
        ("முழு டைனிங் ஹால் மேலாண்மை", "டேபிள் கிளாத், பேப்பர் ரோல், சுத்தமான வாழை இலை விரிப்பு மற்றும் பயிற்சி பெற்ற சர்வீஸ் பணியாளர்கள்."),
        ("கஸ்டம் மெனு மாற்றம்", "குடும்ப விருப்பத்திற்கேற்ப சாத வகைகள், இனிப்புகள் மற்றும் லைவ் கவுண்டர்களை மாற்றியமைத்துக் கொள்ளலாம்.")
    ]
    by = lower_y + 60
    for title, desc in b_items:
        draw.ellipse([70, by+5, 80, by+15], fill=(180, 83, 9))
        draw.text((95, by), title, font=fonts['sec_title'], fill=(69, 10, 10))
        draw.text((95, by+26), desc, font=fonts['body_reg'], fill=(78, 71, 62))
        by += 64

    draw_footer(draw, width, height, fonts)
    img.save(os.path.join(OUTPUT_DIR, 'card-seemantham-raj-banquet.jpg'), quality=92)
    print("Saved card-seemantham-raj-banquet.jpg")

# =========================================================================
# 7. CARD: TOTAL / LABOUR CONTRACT TRADITIONAL TAMIL FEASTS
# =========================================================================
def make_card_total_labour_contract():
    width, height = 1200, 1850
    img, draw = create_card_canvas(width, height)
    draw_header(img, draw, width, fonts,
                "TRADITIONAL PURE VEGETARIAN FEASTS",
                "சைவ உணவுகள் மொத்த காண்ட்ராக்ட் மற்றும் லேபர் (கூலி) காண்ட்ராக்ட்")
    
    col_w = (width - 140) // 3
    top_y = 325
    card_h = 860
    
    cols = [
        ("பாரம்பரிய இனிப்புகள் & பிரியாணி", [
            "• சர்க்கரை பொங்கல் (Pure Ghee)",
            "• கல்கண்டு சாதம் (Kalkandu)",
            "• கடப்பரசாதம் (Kada Prasadam)",
            "• கவுனி அரிசி பொங்கல் (Black Rice)",
            "• அவுல் பொங்கல் (Aval Pongal)",
            "• காளான் பிரியாணி (Mushroom)",
            "• வெஜ் பிரியாணி (Veg Dum)",
            "• மீல்மேக்கர் பிரியாணி",
            "• நெய் ஜீரா ரைஸ் (Jeera Rice)",
            "• நெய் காஷ்மீர் புலாவ் (Pulao)"
        ]),
        ("10 வகை பாரம்பரிய கலவை சாதங்கள்", [
            "1. புளி சாதம் (Puli Sadham)",
            "2. லெமன் சாதம் (Lemon Sadham)",
            "3. தக்காளி சாதம் (Tomato Rice)",
            "4. புதினா சாதம் (Mint Rice)",
            "5. மல்லி சாதம் (Coriander Rice)",
            "6. கருவேப்பிலை சாதம் (Curry Leaf)",
            "7. தேங்காய் சாதம் (Coconut Rice)",
            "8. மாங்காய் சாதம் (Mango Rice)",
            "9. பருப்பு பொடி நெய் சாதம்",
            "10. கெட்டி தயிர் சாதம் (Curd Rice)"
        ]),
        ("குழம்பு, கூட்டு & தொக்கு வகைகள்", [
            "• கதம்ப புளி கூட்டு",
            "• உருளைக்கிழங்கு மசால்",
            "• தக்காளி தொக்கு",
            "• வெஜ் குருமா",
            "• நெய் சாம்பார்",
            "• கத்திரிக்காய் புளிமண்டி",
            "• புதினா துவையல்",
            "• வத்தல் வடகம்",
            "• மாங்காய் & மாஇஞ்சி ஊறுகாய்",
            "• வெங்காய ஊறுகாய் & மாவடு"
        ])
    ]
    
    for c in range(3):
        title, items = cols[c]
        gx = 50 + c * (col_w + 20)
        draw.rounded_rectangle([gx, top_y, gx+col_w, top_y+card_h], radius=14, fill=(255, 255, 255), outline=(180, 83, 9), width=2)
        draw.rounded_rectangle([gx, top_y, gx+col_w, top_y+50], radius=12, fill=(69, 10, 10))
        draw.text((gx+12, top_y+14), title, font=fonts['col_title'], fill=(254, 240, 138))
        
        iy = top_y + 70
        for it in items:
            draw.text((gx+18, iy), it, font=fonts['body_reg'], fill=(28, 25, 23))
            iy += 38

    # Lower Section: Total Contract vs Labour Contract Breakdown
    lower_y = top_y + card_h + 24
    lower_h = height - lower_y - 110
    draw.rounded_rectangle([50, lower_y, width-50, lower_y+lower_h], radius=16, fill=(254, 252, 232), outline=(212, 175, 55), width=2)
    draw.rounded_rectangle([50, lower_y, width-50, lower_y+46], radius=14, fill=(69, 10, 10))
    draw.text((70, lower_y+12), "காண்ட்ராக்ட் முறைகள் (Booking Modes Available)", font=fonts['col_title'], fill=(254, 240, 138))
    
    modes = [
        ("1. மொத்த காண்ட்ராக்ட் (Total Contract with Materials):", "அரிசி, பருப்பு, காய்கறிகள், தூய நெய், மளிகை சாமான்கள் மற்றும் சர்வீஸ் அனைத்தும் ஸ்ரீ கேட்டரர்ஸ் ஏற்பாடு செய்து தரும்."),
        ("2. லேபர் காண்ட்ராக்ட் (Labour / Coolie Contract Only):", "மளிகை பொருட்கள் பார்ட்டி ஏற்பாடு செய்து தரலாம்; தேர்ந்த தலைமை மாஸ்டர் செஃப்கள் மற்றும் யூனிபார்ம் சர்வீஸ் பணியாளர்கள் மட்டும் சமைத்து பரிமாறுவார்கள்."),
        ("சுப நிகழ்வுகள் அனைத்திற்கும்:", "திருமணம், நிச்சயதார்த்தம், கிரகப்பிரவேசம், காதணி விழா, சீமந்தம் மற்றும் பிறந்தநாள் விழாக்களுக்கு சிறந்த சேவை.")
    ]
    my = lower_y + 60
    for m_title, m_desc in modes:
        draw.ellipse([70, my+5, 80, my+15], fill=(180, 83, 9))
        draw.text((95, my), m_title, font=fonts['sec_title'], fill=(69, 10, 10))
        draw.text((95, my+26), m_desc, font=fonts['body_reg'], fill=(78, 71, 62))
        my += 64

    draw_footer(draw, width, height, fonts)
    img.save(os.path.join(OUTPUT_DIR, 'card-total-labour-contract.jpg'), quality=92)
    print("Saved card-total-labour-contract.jpg")

# =========================================================================
# 8. CARD: 2-DAY GRAND WEDDING SCHEDULE & BANQUET BOOKLET
# =========================================================================
# 8. CARD: 2-DAY GRAND WEDDING CELEBRATION & EVENT SCHEDULE
# =========================================================================
def make_card_2day_wedding_schedule():
    width, height = 1200, 1850
    img, draw = create_card_canvas(width, height)
    draw_header(img, draw, width, fonts,
                "2-DAY GRAND WEDDING CELEBRATION & FEAST SCHEDULE",
                "2 நாள் பிரமாண்ட திருமண நிகழ்வு & முழு விருந்து அட்டவணை")
    
    col_w = (width - 120) // 2
    lx = 50
    rx = lx + col_w + 20
    top_y = 325
    card_h = height - 435
    
    # Left: Day 1
    draw.rounded_rectangle([lx, top_y, lx+col_w, top_y+card_h], radius=16, fill=(255, 255, 255), outline=(180, 83, 9), width=2)
    draw.rounded_rectangle([lx, top_y, lx+col_w, top_y+50], radius=14, fill=(69, 10, 10))
    draw.text((lx+20, top_y+14), "DAY 1: WELCOME & ROYAL RECEPTION", font=fonts['col_title'], fill=(254, 240, 138))
    
    day1_sections = [
        ("வெல்கம் டிரிங்க்ஸ் & மாலை சிற்றுண்டி", [
            "• வாட்டர்மெலான் & திராட்சை பிரஷ் ஜூஸ்",
            "• சூடான காளான் சூப் கவுண்டர்",
            "• பாரம்பரிய வரவேற்பு பெண்கள்",
            "• கும்பகோணம் டிகிரி காபி & டீ",
            "• சூடான கேரட் அல்வா & மெது போண்டா"
        ]),
        ("இரவு பிரமாண்ட வரவேற்பு விருந்து (Dinner)", [
            "• ஆம்பூர் மட்டன் பிரியாணி (Dum Biryani)",
            "• மொறுமொறு சிக்கன் 65",
            "• சிக்கன் கிரேவி & தால்சா",
            "• எண்ணெய் கத்திரிக்காய் & தயிர் பச்சடி",
            "• பிரட் அல்வா & மீத்தா கானா",
            "• பஞ்சாபி நான் ரொட்டி / பரோட்டா",
            "• பன்னீர் பட்டர் மசாலா (Pure Veg)",
            "• வெஜ் புலாவ் & தயிர் சாதம்",
            "• பழ சாலட், ஐஸ்கிரீம் & பீடா"
        ])
    ]
    iy = top_y + 68
    for sec, its in day1_sections:
        draw.rectangle([lx+14, iy, lx+col_w-14, iy+28], fill=(254, 243, 199))
        draw.text((lx+22, iy+4), sec, font=fonts['sec_title'], fill=(180, 83, 9))
        iy += 38
        for it in its:
            draw.text((lx+24, iy), it, font=fonts['body_reg'], fill=(28, 25, 23))
            iy += 34
        iy += 14

    # Right: Day 2
    draw.rounded_rectangle([rx, top_y, rx+col_w, top_y+card_h], radius=16, fill=(255, 255, 255), outline=(180, 83, 9), width=2)
    draw.rounded_rectangle([rx, top_y, rx+col_w, top_y+50], radius=14, fill=(69, 10, 10))
    draw.text((rx+20, top_y+14), "DAY 2: MUHURTHAM & GRAND FEAST", font=fonts['col_title'], fill=(254, 240, 138))
    
    day2_sections = [
        ("காலை சுப முகூர்த்த சிற்றுண்டி (Breakfast)", [
            "• மல்லிகைப்பூ தட்டு இட்லி & மெது வடை",
            "• நெய் பொங்கல் & அசோகா அல்வா",
            "• மொறுமொறு மசால் தோசை & பூரி மசால்",
            "• முருங்கைக்காய் சாம்பார் & தக்காளி சட்னி",
            "• தேங்காய் சட்னி & கொத்தமல்லி சட்னி",
            "• கும்பகோணம் பில்டர் காபி & டீ"
        ]),
        ("மதிய பிரமாண்ட கல்யாண விருந்து (Grand Lunch)", [
            "• இனிப்பு போளி / பாதாம் கீர்",
            "• சுடச்சுட சாதம் & பருப்பு நெய்",
            "• கல்யாண முருங்கை சாம்பார் & வத்தக்குழம்பு",
            "• தக்காளி பூண்டு ரசம் & கெட்டி மோர்",
            "• உருளைக்கிழங்கு கார வறுவல் & சேனை ரோஸ்ட்",
            "• காய்கறி அவியல் & வாழைப்பூ வடை",
            "• அப்பளம், தயிர் பச்சடி & மாங்காய் ஊறுகாய்",
            "• அட பிரதமன் பாயாசம் & கல்கத்தா பீடா"
        ])
    ]
    iy = top_y + 68
    for sec, its in day2_sections:
        draw.rectangle([rx+14, iy, rx+col_w-14, iy+28], fill=(254, 243, 199))
        draw.text((rx+22, iy+4), sec, font=fonts['sec_title'], fill=(180, 83, 9))
        iy += 38
        for it in its:
            draw.text((rx+24, iy), it, font=fonts['body_reg'], fill=(28, 25, 23))
            iy += 34
        iy += 14

    draw_footer(draw, width, height, fonts)
    img.save(os.path.join(OUTPUT_DIR, 'card-2day-wedding-schedule.jpg'), quality=92)
    print("Saved card-2day-wedding-schedule.jpg")

# =========================================================================
# 9. CARD: MUTTON BIRYANI BANANA LEAF PACKAGE (₹269/-) (Balanced Layout)
# =========================================================================
def make_card_mutton_biryani():
    width, height = 1200, 1850
    img, draw = create_card_canvas(width, height)
    draw_header(img, draw, width, fonts,
                "AUTHENTIC WOOD-FIRE MUTTON BIRYANI PACKAGE",
                "விறகடுப்பு மட்டன் பிரியாணி இலை சாப்பாடு (₹269/-)")
    
    top_y = 330
    draw.rounded_rectangle([70, top_y, width-70, top_y+840], radius=20, fill=(255, 255, 255), outline=(180, 83, 9), width=2)
    
    draw.rounded_rectangle([100, top_y+20, width-100, top_y+85], radius=14, fill=(69, 10, 10))
    p_text = "₹269 / Banana Leaf Meal  •  100% Halal Certified Mutton"
    pb = draw.textbbox((0, 0), p_text, font=fonts['col_title'])
    draw.text(((width - (pb[2]-pb[0]))//2, top_y+36), p_text, font=fonts['col_title'], fill=(254, 240, 138))
    
    inclusions = [
        ("விறகடுப்பு மட்டன் பிரியாணி (Wood-Fire Mutton Biryani)", "பாரம்பரிய சீரக சம்பா அரிசி, மெதுவான ஆட்டிறைச்சி, சுத்தமான நெய் மற்றும் நறுமண மசாலாக்களுடன் விறகடுப்பில் சமைக்கப்பட்டது."),
        ("பிரட் அல்வா (Rich Bread Halwa)", "வறுத்த முந்திரி, உலர் திராட்சை, தூய நெய் கலந்து செய்யப்பட்ட நாவில் கரையும் அல்வா."),
        ("வெங்காய பச்சடி (Chilled Onion Raitha)", "கெட்டி தயிரில் செய்யப்பட்ட பாரம்பரிய ஆனியன் ரைத்தா."),
        ("எண்ணெய் கத்திரிக்காய் கிரேவி (Ennai Kathirikai Curry)", "கல்யாண பிரியாணிக்கு உகந்த சுவையான எண்ணெய் கத்திரிக்காய் தொக்கு."),
        ("சுத்தமான தலைவாழை இலை (Fresh Plantain Leaf)", "பாரம்பரிய வாழை இலை பரிமாறுதல்."),
        ("மினரல் வாட்டர் பாட்டில் (300ml Bottled Water)", "ஹைஜீனிக் பேக்கேஜ் செய்யப்பட்ட குடிநீர் பாட்டில்."),
        ("ஸ்பெஷல் சிக்கன் 65 (Chicken 65 Add-On Option)", "விருப்பப்பட்டால் கூடுதலாக சிக்கன் 65 சேர்த்துக் கொள்ளலாம் (+₹50/- மட்டும்).")
    ]
    
    iy = top_y + 105
    for name, desc in inclusions:
        draw.rounded_rectangle([100, iy, width-100, iy+92], radius=12, fill=(254, 252, 232), outline=(234, 179, 8), width=1)
        draw.ellipse([120, iy+16, 132, iy+28], fill=(180, 83, 9))
        draw.text((145, iy+14), name, font=fonts['sec_title'], fill=(69, 10, 10))
        lines = wrap_text(desc, fonts['body_reg'], width-300, draw)
        ly = iy + 44
        for l in lines:
            draw.text((145, ly), l, font=fonts['body_reg'], fill=(78, 71, 62))
            ly += 22
        iy += 102

    # Lower Section: Quality Promise & Event Occasions (Like original flyer)
    lower_y = top_y + 865
    lower_h = height - lower_y - 110
    draw.rounded_rectangle([70, lower_y, width-70, lower_y+lower_h], radius=16, fill=(254, 252, 232), outline=(212, 175, 55), width=2)
    
    # Left Half: Our Promise
    pw = (width - 180) // 2
    draw.rounded_rectangle([90, lower_y+16, 90+pw, lower_y+lower_h-16], radius=12, fill=(255, 255, 255), outline=(180, 83, 9), width=1)
    draw.rounded_rectangle([90, lower_y+16, 90+pw, lower_y+56], radius=10, fill=(69, 10, 10))
    draw.text((110, lower_y+26), "OUR PROMISE & QUALITY", font=fonts['sec_title'], fill=(254, 240, 138))
    
    promise_items = [
        ("Hygienic Preparation:", "சுகாதாரமான சூழலில் தரமான பொருட்களுடன் தயாரிப்பு."),
        ("Quality Ingredients:", "தூய நெய், சீரக சம்பா அரிசி & தரமான மட்டன்."),
        ("On Time Service:", "குறிப்பிட்ட நேரத்தில் சுடச்சுட பரிமாறும் சேவை."),
        ("Memorable Taste:", "பாரம்பரிய திருமண விருந்து சுவை உத்தரவாதம்.")
    ]
    py = lower_y + 70
    for p_title, p_desc in promise_items:
        draw.ellipse([110, py+5, 118, py+13], fill=(180, 83, 9))
        draw.text((130, py), p_title, font=fonts['body_small_bold'], fill=(69, 10, 10))
        draw.text((130, py+22), p_desc, font=fonts['body_small'], fill=(78, 71, 62))
        py += 52

    # Right Half: Perfect For Occasions
    rx = 90 + pw + 20
    draw.rounded_rectangle([rx, lower_y+16, rx+pw, lower_y+lower_h-16], radius=12, fill=(255, 255, 255), outline=(180, 83, 9), width=1)
    draw.rounded_rectangle([rx, lower_y+16, rx+pw, lower_y+56], radius=10, fill=(69, 10, 10))
    draw.text((rx+20, lower_y+26), "PERFECT FOR ALL OCCASIONS", font=fonts['sec_title'], fill=(254, 240, 138))
    
    occ_items = [
        ("திருமணங்கள் (Weddings):", "மண்டபங்களில் தலைவாழை இலை விருந்து."),
        ("நிச்சயதார்த்தம் (Engagements):", "அறுசுவை அசைவ விருந்து பரிமாறுதல்."),
        ("இல்ல விழாக்கள் (Parties & Family):", "பிறந்தநாள், காதணி, வளைகாப்பு விருந்து."),
        ("கார்ப்பரேட் நிகழ்வுகள் (Corporate):", "அலுவலக மற்றும் நிறுவன விருந்துகள்.")
    ]
    oy = lower_y + 70
    for o_title, o_desc in occ_items:
        draw.ellipse([rx+20, oy+5, rx+28, oy+13], fill=(22, 101, 52))
        draw.text((rx+38, oy), o_title, font=fonts['body_small_bold'], fill=(22, 101, 52))
        draw.text((rx+38, oy+22), o_desc, font=fonts['body_small'], fill=(78, 71, 62))
        oy += 52

    draw_footer(draw, width, height, fonts)
    img.save(os.path.join(OUTPUT_DIR, 'card-mutton-biryani-pkg.jpg'), quality=92)
    print("Saved card-mutton-biryani-pkg.jpg")

# =========================================================================
# 10. CARD: CHICKEN BIRYANI BANANA LEAF PACKAGE (₹149/-) (Balanced Layout)
# =========================================================================
def make_card_chicken_biryani():
    width, height = 1200, 1850
    img, draw = create_card_canvas(width, height)
    draw_header(img, draw, width, fonts,
                "TAMIL DUM CHICKEN BIRYANI PACKAGE",
                "சிக்கன் பிரியாணி இலை சாப்பாடு (₹149/-)")
    
    top_y = 330
    draw.rounded_rectangle([70, top_y, width-70, top_y+840], radius=20, fill=(255, 255, 255), outline=(180, 83, 9), width=2)
    
    draw.rounded_rectangle([100, top_y+20, width-100, top_y+85], radius=14, fill=(69, 10, 10))
    p_text = "₹149 / Banana Leaf Meal  •  Affordable Grand Feast"
    pb = draw.textbbox((0, 0), p_text, font=fonts['col_title'])
    draw.text(((width - (pb[2]-pb[0]))//2, top_y+36), p_text, font=fonts['col_title'], fill=(254, 240, 138))
    
    inclusions = [
        ("தமிழ் தம் சிக்கன் பிரியாணி (Tamil Dum Chicken Biryani)", "சுவையான சிக்கன் துண்டுடன் பாரம்பரிய முறைப்படி சீரக சம்பா / பாஸ்மதி அரிசியில் சமைக்கப்பட்டது."),
        ("பிரட் அல்வா (Rich Bread Halwa)", "நெய்யில் வறுத்த முந்திரிப் பருப்புடன் தயார் செய்யப்பட்ட சுவையான பிரட் அல்வா."),
        ("வெங்காய பச்சடி (Chilled Onion Raitha)", "கெட்டி தயிரில் செய்யப்பட்ட ஆனியன் ரைத்தா."),
        ("கத்திரிக்காய் கிரேவி (Traditional Brinjal Curry)", "பிரியாணிக்கு தொட்டுக்கொள்ள மணக்கும் கத்திரிக்காய் கிரேவி."),
        ("சுத்தமான வாழை இலை (Fresh Plantain Leaf Plate)", "நேர்த்தியான வாழை இலை விரிப்பு சர்வீஸ்."),
        ("மினரல் வாட்டர் பாட்டில் (300ml Bottled Water)", "பாதுகாப்பான பேக்கேஜ் செய்யப்பட்ட குடிநீர்."),
        ("சிக்கன் 65 கூடுதல் சலுகை (Chicken 65 Add-On)", "விருப்பப்பட்டால் கூடுதலாக சுவையான சிக்கன் 65 சேர்க்கலாம் (+₹50/- மட்டும்).")
    ]
    
    iy = top_y + 105
    for name, desc in inclusions:
        draw.rounded_rectangle([100, iy, width-100, iy+92], radius=12, fill=(254, 252, 232), outline=(234, 179, 8), width=1)
        draw.ellipse([120, iy+16, 132, iy+28], fill=(180, 83, 9))
        draw.text((145, iy+14), name, font=fonts['sec_title'], fill=(69, 10, 10))
        lines = wrap_text(desc, fonts['body_reg'], width-300, draw)
        ly = iy + 44
        for l in lines:
            draw.text((145, ly), l, font=fonts['body_reg'], fill=(78, 71, 62))
            ly += 22
        iy += 102

    # Lower Section: Highlights & Booking
    lower_y = top_y + 865
    lower_h = height - lower_y - 110
    draw.rounded_rectangle([70, lower_y, width-70, lower_y+lower_h], radius=16, fill=(254, 252, 232), outline=(212, 175, 55), width=2)
    
    pw = (width - 180) // 2
    draw.rounded_rectangle([90, lower_y+16, 90+pw, lower_y+lower_h-16], radius=12, fill=(255, 255, 255), outline=(180, 83, 9), width=1)
    draw.rounded_rectangle([90, lower_y+16, 90+pw, lower_y+56], radius=10, fill=(69, 10, 10))
    draw.text((110, lower_y+26), "OUR PROMISE & QUALITY", font=fonts['sec_title'], fill=(254, 240, 138))
    
    promise_items = [
        ("Hygienic Preparation:", "சுகாதாரமான முறையில் சுத்தமான சமையல் அறை."),
        ("Quality Ingredients:", "100% ஃப்ரெஷ் சிக்கன் & தரமான மசாலா பொருட்கள்."),
        ("On Time Service:", "நிகழ்வு நேரத்திற்கு முன்பே பரிமாறும் தயார்நிலை."),
        ("Budget Friendly:", "குறைந்த விலையில் நிறைவான கல்யாண விருந்து.")
    ]
    py = lower_y + 70
    for p_title, p_desc in promise_items:
        draw.ellipse([110, py+5, 118, py+13], fill=(180, 83, 9))
        draw.text((130, py), p_title, font=fonts['body_small_bold'], fill=(69, 10, 10))
        draw.text((130, py+22), p_desc, font=fonts['body_small'], fill=(78, 71, 62))
        py += 52

    rx = 90 + pw + 20
    draw.rounded_rectangle([rx, lower_y+16, rx+pw, lower_y+lower_h-16], radius=12, fill=(255, 255, 255), outline=(180, 83, 9), width=1)
    draw.rounded_rectangle([rx, lower_y+16, rx+pw, lower_y+56], radius=10, fill=(69, 10, 10))
    draw.text((rx+20, lower_y+26), "PERFECT FOR ALL OCCASIONS", font=fonts['sec_title'], fill=(254, 240, 138))
    
    occ_items = [
        ("குடும்ப சுபநிகழ்ச்சிகள்:", "பிறந்தநாள், காதணி விழா மற்றும் இல்ல விழாக்கள்."),
        ("திருமண வரவேற்பு:", "அனைவரும் விரும்பும் சுவையான சிக்கன் பிரியாணி."),
        ("நண்பர்கள் & பார்ட்டி:", "கல்லூரி, பள்ளி ரீ-யூனியன் & நண்பர்கள் விருந்து."),
        ("சென்னை முழுவதும்:", "வில்லிவாக்கம், பெரம்பூர், ஆவடி, அம்பத்தூர் சர்வீஸ்.")
    ]
    oy = lower_y + 70
    for o_title, o_desc in occ_items:
        draw.ellipse([rx+20, oy+5, rx+28, oy+13], fill=(22, 101, 52))
        draw.text((rx+38, oy), o_title, font=fonts['body_small_bold'], fill=(22, 101, 52))
        draw.text((rx+38, oy+22), o_desc, font=fonts['body_small'], fill=(78, 71, 62))
        oy += 52

    draw_footer(draw, width, height, fonts)
    img.save(os.path.join(OUTPUT_DIR, 'card-chicken-biryani-pkg.jpg'), quality=92)
    print("Saved card-chicken-biryani-pkg.jpg")

# =========================================================================
# 11. CARD: GRAND ROYAL WEDDING PACKAGE (₹1,75,000/-) (Balanced Layout)
# =========================================================================
def make_card_wedding_royal_175k():
    width, height = 1200, 1850
    img, draw = create_card_canvas(width, height)
    draw_header(img, draw, width, fonts,
                "GRAND ROYAL WEDDING & EVENT COMPLETE PACKAGE",
                "ராயல் திருமண விருந்து முழுமையான பேக்கேஜ் (₹1,75,000/- • 100% Halal Certified)")
    
    col_w = (width - 140) // 3
    top_y = 325
    card_h = 860
    
    cols = [
        ("நேரடி ஸ்டால்கள் (LIVE STALLS)", [
            "• டீ & காபி மெஷின் லைவ்",
            "• மோஜிட்டோ கவுண்டர் லைவ்",
            "• ஃப்ரூட் சாலட் பார் (Fruit Salad)",
            "• முக்கனி ஐஸ்கிரீம் (Mukkani)",
            "• கல்கத்தா ஸ்வீட் பீடா ஸ்டால்",
            "• வெல்கம் ஜூஸ் கவுண்டர்",
            "• பேப்பர் கப் & டிஷ்யூ பேப்பர்"
        ]),
        ("விறகடுப்பு மட்டன் பிரியாணி", [
            "• விறகடுப்பு மட்டன் பிரியாணி",
            "• சுவையான சிக்கன் 65",
            "• சிக்கன் கிரேவி",
            "• மெல்லிய இடியாப்பம்",
            "• மீத்தா கானா & பிர்னி",
            "• சூடான நான் ரொட்டி",
            "• எண்ணெய் கத்திரிக்காய் & ரைத்தா",
            "• வாழை இலை & வாட்டர் பாட்டில்"
        ]),
        ("அறுசுவை சைவ விருந்து (VEG)", [
            "• குலோப் ஜாமூன்",
            "• சப்பாத்தி & பன்னீர் பட்டர்",
            "• மினி தட்டு இட்லி & ஊத்தப்பம்",
            "• சாம்பார் & வெஜ் குருமா",
            "• தயிர் சாதம், பிசிபேளேபாத்",
            "• சாதம், தக்காளி ரசம், அப்பளம்",
            "• மாங்காய் ஊறுகாய் & சர்வீஸ் பாய்ஸ்"
        ])
    ]
    
    for c in range(3):
        title, items = cols[c]
        gx = 50 + c * (col_w + 20)
        draw.rounded_rectangle([gx, top_y, gx+col_w, top_y+card_h], radius=14, fill=(255, 255, 255), outline=(180, 83, 9), width=2)
        draw.rounded_rectangle([gx, top_y, gx+col_w, top_y+50], radius=12, fill=(69, 10, 10))
        draw.text((gx+12, top_y+14), title, font=fonts['col_title'], fill=(254, 240, 138))
        
        iy = top_y + 70
        for it in items:
            iy = draw_bullet_item(draw, gx+14, iy, it, fonts['body_reg'], (28, 25, 23), col_w-28)
            iy += 8

    # Lower Section: Royal Wedding Hospitality & Staff Standards
    lower_y = top_y + card_h + 24
    lower_h = height - lower_y - 110
    draw.rounded_rectangle([50, lower_y, width-50, lower_y+lower_h], radius=16, fill=(254, 252, 232), outline=(212, 175, 55), width=2)
    draw.rounded_rectangle([50, lower_y, width-50, lower_y+46], radius=14, fill=(69, 10, 10))
    draw.text((70, lower_y+12), "முழு திருமண நிகழ்வு ஏற்பாடுகள் (Complete Event & Dining Management)", font=fonts['col_title'], fill=(254, 240, 138))
    
    w_items = [
        ("தலைமை மாஸ்டர் செஃப்கள் & 100% ஹலால் சான்றிதழ்", "பாரம்பரிய விறகடுப்பு மட்டன் பிரியாணி மற்றும் பிரத்யேக சைவ சமையலுக்கு தனித்தனி சமையலறைகள்."),
        ("யூனிபார்ம் சர்வீஸ் பணியாளர்கள் & மேற்பார்வை", "சீருடை அணிந்த அனுபவம் வாய்ந்த சர்வீஸ் பாய்ஸ், வாழை இலை மற்றும் டைனிங் டேபிள் ரோல் ஏற்பாடுகள்."),
        ("5 நேரடி லைவ் கவுண்டர்கள்", "விருந்தினர்களை கவரும் மோஜிட்டோ, டீ/காபி மெஷின், ஐஸ்கிரீம், பழ சாலட் மற்றும் தாம்பூல பீடா கவுண்டர்கள்.")
    ]
    wy = lower_y + 60
    for title, desc in w_items:
        draw.ellipse([70, wy+5, 80, wy+15], fill=(180, 83, 9))
        draw.text((95, wy), title, font=fonts['sec_title'], fill=(69, 10, 10))
        draw.text((95, wy+26), desc, font=fonts['body_reg'], fill=(78, 71, 62))
        wy += 64

    draw_footer(draw, width, height, fonts)
    img.save(os.path.join(OUTPUT_DIR, 'card-wedding-royal-175k.jpg'), quality=92)
    print("Saved card-wedding-royal-175k.jpg")

# =========================================================================
# 12. CARD: MEGA WEDDING CELEBRATION (₹1.98 LAKHS / 600 PAX)
# =========================================================================
def make_card_mega_600pax_198k():
    width, height = 1200, 1850
    img, draw = create_card_canvas(width, height)
    draw_header(img, draw, width, fonts,
                "MEGA WEDDING CELEBRATION PACKAGE (600 GUESTS)",
                "மெகா திருமண & வரவேற்பு பேக்கேஜ் (600 நபர்கள் - ₹1.98 லட்சம் மட்டுமே)")
    
    top_y = 330
    draw.rounded_rectangle([100, top_y, width-100, height-440], radius=20, fill=(255, 255, 255), outline=(180, 83, 9), width=3)
    
    draw.rounded_rectangle([140, top_y+25, width-140, top_y+115], radius=16, fill=(69, 10, 10))
    p_text = "₹1.98 Lakhs Only  •  Complete Event Management & Catering (600 Pax)"
    pb = draw.textbbox((0, 0), p_text, font=fonts['col_title'])
    draw.text(((width - (pb[2]-pb[0]))//2, top_y+52), p_text, font=fonts['col_title'], fill=(254, 240, 138))
    
    inclusions = [
        ("600 நபர்களுக்கான பிரமாண்ட டின்னர் விருந்து", "அசைவம் & சைவம் கலந்த சுவையான உயர்தர விருந்து உணவு பரிமாறுதல்."),
        ("புரொபஷனல் போட்டோகிராபி & வீடியோகிராபி", "முழு திருமண நிகழ்வுக்கான HD போட்டோ மற்றும் வீடியோ கவரேஜ்."),
        ("DJ மியூசிக் & சவுண்ட் சிஸ்டம்", "உயர்தர ஒலி அமைப்புடன் கூடிய DJ இசை மற்றும் லைட்டிங்."),
        ("பாப்கார்ன் & பஞ்சுமிட்டாய் லைவ் கவுண்டர்", "குழந்தைகள் மற்றும் விருந்தினர்களை கவரும் சுழலும் இயந்திர கவுண்டர்கள்."),
        ("வெல்கம் ஜூஸ் & வெல்கம் கேர்ள்ஸ் (Welcome Girls)", "பாரம்பரிய உடையில் விருந்தினர்களை வரவேற்கும் வரவேற்பு பெண்கள்."),
        ("ஐஸ்கிரீம் & கல்கத்தா பீடா கவுண்டர்", "சுவையான ஐஸ்கிரீம் மற்றும் தாம்பூல பீடா வகைகள்."),
        ("மணப்பெண் HD மேக்கப் & புடவை கட்டுதல்", "Bridal HD Makeup, Saree Draping & Mehandi Artist ஏற்பாடு."),
        ("ரிசப்ஷன் ஜோதிகா மாலை (2 Nos)", "மணமகன் & மணமகளுக்கான பிரத்யேக வரவேற்பு ஜோதிகா மாலைகள்."),
        ("பாரம்பரிய கேரளா செண்டை மேளம் (6 Artists)", "மங்களகரமான வரவேற்புக்கு 6 கலைஞர்கள் கொண்ட செண்டை மேளம்."),
        ("டைனிங் டேபிள் மற்றும் அரங்கம் அலங்காரம்", "நேர்த்தியான டேபிள் கிளாத் மற்றும் பேப்பர் ரோல் அலங்காரம்.")
    ]
    
    iy = top_y + 135
    for name, desc in inclusions:
        draw.rounded_rectangle([140, iy, width-140, iy+78], radius=10, fill=(254, 252, 232), outline=(234, 179, 8), width=1)
        draw.ellipse([156, iy+14, 166, iy+24], fill=(180, 83, 9))
        draw.text((180, iy+10), name, font=fonts['sec_title'], fill=(69, 10, 10))
        lines = wrap_text(desc, fonts['body_reg'], width-380, draw)
        ly = iy + 38
        for l in lines:
            draw.text((180, ly), l, font=fonts['body_reg'], fill=(78, 71, 62))
            ly += 22
        iy += 88

    draw_footer(draw, width, height, fonts)
    img.save(os.path.join(OUTPUT_DIR, 'card-mega-600pax-198k.jpg'), quality=92)
    print("Saved card-mega-600pax-198k.jpg")

# =========================================================================
# 13. CARD: GRAND RECEPTION SERVICES & DUAL FEASTS
# =========================================================================
def make_card_reception_services():
    width, height = 1200, 1850
    img, draw = create_card_canvas(width, height)
    draw_header(img, draw, width, fonts,
                "GRAND RECEPTION EVENT MANAGEMENT & FEASTS",
                "திருமண வரவேற்பு & நிகழ்வு மேலாண்மை முழுமையான தொகுப்பு")
    
    col_w = (width - 120) // 2
    lx = 50
    rx = lx + col_w + 20
    top_y = 325
    card_h = height - 435
    
    # Left: Dual Feasts
    draw.rounded_rectangle([lx, top_y, lx+col_w, top_y+card_h], radius=16, fill=(255, 255, 255), outline=(180, 83, 9), width=2)
    draw.rounded_rectangle([lx, top_y, lx+col_w, top_y+50], radius=14, fill=(69, 10, 10))
    draw.text((lx+20, top_y+14), "DUAL VEG & NON-VEG FEASTS", font=fonts['col_title'], fill=(254, 240, 138))
    
    veg_nonveg = [
        ("அசைவ விருந்து (Non-Veg Lineup)", [
            "• சிக்கன் பிரியாணி (Seeraga Samba)",
            "• சிக்கன் 65 & பிரட் அல்வா",
            "• ஆனியன் ரைத்தா & கத்திரிக்காய் கிரேவி",
            "• வாழை இலை & வாட்டர் பாட்டில் 300ml",
            "• கட் ஃப்ரூட்ஸ் & மட்டன் கோலா உருண்டை (Extra)"
        ]),
        ("சைவ விருந்து (Vegetarian Lineup)", [
            "• இளநீர் பாயாசம் & உலர் ஜாமூன்",
            "• சப்பாத்தி & சென்னா மசாலா",
            "• இடியாப்பம் & வெஜ் குருமா",
            "• கோபி 65, கூட்டு, பொரியல்",
            "• சுடச்சுட சாதம், சாம்பார், ரசம், வத்தக்குழம்பு",
            "• கெட்டி மோர், அப்பளம், ஊறுகாய், சிப்ஸ்"
        ])
    ]
    iy = top_y + 68
    for sec, its in veg_nonveg:
        draw.rectangle([lx+14, iy, lx+col_w-14, iy+28], fill=(254, 243, 199))
        draw.text((lx+22, iy+4), sec, font=fonts['sec_title'], fill=(180, 83, 9))
        iy += 38
        for it in its:
            draw.text((lx+24, iy), it, font=fonts['body_reg'], fill=(28, 25, 23))
            iy += 34
        iy += 14

    # Right: Stalls, Music & Garlands
    draw.rounded_rectangle([rx, top_y, rx+col_w, top_y+card_h], radius=16, fill=(255, 255, 255), outline=(180, 83, 9), width=2)
    draw.rounded_rectangle([rx, top_y, rx+col_w, top_y+50], radius=14, fill=(69, 10, 10))
    draw.text((rx+20, top_y+14), "STALLS, STAGE & ENTERTAINMENT", font=fonts['col_title'], fill=(254, 240, 138))
    
    stalls_ent = [
        ("நேரடி ஸ்டால்கள் (Live Stalls)", [
            "• வெல்கம் டிரிங்க் (Welcome Drink)",
            "• பஞ்சுமிட்டாய் & பாப்கார்ன் மிஷின்",
            "• ஐஸ்கிரீம் கவுண்டர் & ஸ்வீட் பீடா",
            "• ஃப்ரூட் சாலட் & பானி பூரி லைவ்"
        ]),
        ("இசை & மேடை ஏற்பாடுகள்", [
            "• DISC JOCKEY With PA System (DJ Music)",
            "• வரவேற்பு ஜோதிகா மாலை - 2 Nos",
            "• பூ செண்டு (Bouquet)"
        ]),
        ("மணப்பெண் அலங்காரம் (Bridal Styling)", [
            "• MAC HD Makeup Artist",
            "• Hair Do Styling & Saree Draping"
        ])
    ]
    iy = top_y + 68
    for sec, its in stalls_ent:
        draw.rectangle([rx+14, iy, rx+col_w-14, iy+28], fill=(254, 243, 199))
        draw.text((rx+22, iy+4), sec, font=fonts['sec_title'], fill=(180, 83, 9))
        iy += 38
        for it in its:
            draw.text((rx+24, iy), it, font=fonts['body_reg'], fill=(28, 25, 23))
            iy += 34
        iy += 14

    draw_footer(draw, width, height, fonts)
    img.save(os.path.join(OUTPUT_DIR, 'card-reception-services.jpg'), quality=92)
    print("Saved card-reception-services.jpg")

if __name__ == '__main__':
    make_card_dinner299_tiffen160()
    make_card_traditional_4tier()
    make_card_reception_13stalls()
    make_card_tiffin_combos_1_9()
    make_card_baby_shower_variety_rices()
    make_card_seemantham_raj_banquet()
    make_card_total_labour_contract()
    make_card_2day_wedding_schedule()
    make_card_mutton_biryani()
    make_card_chicken_biryani()
    make_card_wedding_royal_175k()
    make_card_mega_600pax_198k()
    make_card_reception_services()
    print("ALL 13 REFINED ROYAL MENU CARDS SUCCESSFULLY GENERATED!")
