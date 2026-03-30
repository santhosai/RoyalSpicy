## 🎯 COPY THIS EXACTLY INTO CLAUDE (VSCode)

Just copy everything below (from "You are a professional..." to the end).
Paste into Claude chat in VSCode.
Send it.
Done!

---

You are a professional web developer building a production Restaurant POS system.

SYSTEM: Royal Spicy Restaurant - Point of Sale

DESIGN:
- White background, Dark text (#1a1a1a), Orange accents (#ff6b35)
- Fullscreen app (no browser UI)
- Large touch buttons (44px minimum)
- Professional restaurant appearance
- Works on iPad/Android tablets

FEATURES REQUIRED:

1. DASHBOARD SCREEN:
   - 12 table grid (clickable buttons)
   - Statistics: Active Orders, Today Revenue, Items Sold
   - Reports button
   - Clear data button

2. ORDERS SCREEN:
   - Category selector (Veg Soup, Non-Veg Soup, Egg Starters, Veg Starters, Chicken, Sea Food, Veg Curries, Chicken Curries, Bread, Rice, Biryanis, Beverages)
   - Menu items grid (add to order)
   - Bill panel (sticky, right side)
   - Item quantity controls (+/- buttons)
   - Discount % input (0-100)
   - Customer mobile optional
   - Payment method (Cash, Card, UPI)
   - Print button
   - Calculations: Subtotal → Discount % → GST (5%) → Total

3. BILLING:
   - Real-time calculations
   - Subtotal = sum(price × qty)
   - Discount = subtotal × (discount% / 100)
   - After discount = subtotal - discount
   - GST = after discount × 0.05
   - Total = after discount + GST
   - Professional receipt format (monospace, 80mm width)

4. BLUETOOTH PRINTING:
   - Web Bluetooth API
   - Connect to 2mm thermal printer (80mm rolls)
   - ESC/POS format
   - Send receipt to printer
   - Plain text format

5. CUSTOMER TRACKING:
   - Optional mobile number
   - Store in localStorage
   - Track repeat customers (visits, total spent, last visit)

6. REPORTS:
   - Daily revenue total
   - Average bill value
   - Items sold count
   - Customer list (mobile, visits, amount spent)

7. DATA:
   - localStorage persistence
   - Works offline completely
   - No backend/server needed

MENU DATA (all items with prices):

Veg Soup: Corn soup 80, Manchow soup 80, Hot & Sour 80

Non-Veg Soup: Chicken corn soup 95, Chicken manchow 95, Chicken Hot & Sour 95

Egg Starters: Egg 65 180, Egg manchuria 180, Egg Burgi 100, Chilli Egg 180, Egg omlet 70

Veg Starters: Veg Manchuria 170, Gobi Manchuria 170, Gobi 65 170, Paneer 65 220, Paneer Manchuria 220, Chilli Paneer 210, Baby corn 65 180

Chicken Starters: Chicken 65 220, Pepper Chicken 240, Chilli Chicken 220, Chicken Fry 240, Chicken 777 240, Chilli Drumsticks 240, Chicken Manchuria 240, Chicken Lollipop 250, Crispy Chicken 240

Sea Food Starters: Appollo Fish 270, Chilli Fish 270, Chilli Prawns 280, Lemon Fish 270, Prawns 65 280

Tandoori Starters: Tandoori Chicken Single 200, Tandoori Chicken Full 400, Tangdi Kabab 300, Paneer Tikka 260

Chinese Main (Veg): Soft Noodles 160, Fried Rice 160, Schezwan Fried Rice 180, Schezwan Noodles 180

Chinese Main (Non-Veg): Egg Soft Noodles 170, Chicken Soft Noodles 190, Chicken Schezwan Noodles 200, Chicken Fried Rice 190

Veg Curries: Dal Fry 160, Paneer Do Pyaza 230, Paneer Butter Masala 230, Baby corn Mushroom 230, Veg Kolhapuri 200, Kadai Paneer 230, Aloo Mutter 180

Chicken Curries: Chicken Curry 230, Butter Chicken 230, Kadai Chicken 230, Chicken Kolhapuri 250, Murg Musallam 450

Mutton Curries: Mutton Masala 320, Mutton Curry 320

Sea Food Curries: Fish Curry 280, Fish Masala 280, Prawns Curry 280

Bread Basket: Phulka 20, Chapathi 25, Tandoor Roti 30, Butter Naan 40, Garlic Naan 50, Aloo Paratha 80

Rice: Plain Rice 80, Lemon Rice 120, Tomato Rice 140, Zeera Rice 120

Veg Biryanis: Veg Biryani 170, Kaju Biryani 200, Paneer Biryani 200, Veg Biryani Full 200

Non-Veg Biryanis: Chicken Biryani 220, Chicken Biryani Full 250, Gongura Chicken Biryani 250, Mutton Biryani 300, Fish Biryani 280, Prawns Biryani 280

Family Packs: Chicken Dum Family pack 600, Veg Family pack 400, Chicken Jumbo 700, Mutton Jumbo 800

Beverages: Water 20, Soft Drink 20, Lassi 50, Fresh Lime Soda 50

RESTAURANT INFO:
Name: ROYAL SPICY RESTAURANT
Phone: +91 88979 31711
Address: Kondapur Road, Hyderabad

TECHNICAL:
- Single index.html file (all CSS & JavaScript embedded)
- No separate files, no build tools, no dependencies
- manifest.json for PWA installation
- package.json for Vercel deployment
- Works completely offline
- iOS/Android compatible

DELIVERABLES:
Generate 3 complete production-ready files:

1. index.html - Complete working app (~2000-2500 lines)
   - All CSS in <style> tag
   - All JavaScript in <script> tag
   - Ready to open directly in browser
   - Fullscreen on mobile (hides address bar)
   - Professional design
   - All features working

2. manifest.json - PWA configuration
   - App name: "Royal Spicy POS"
   - Display mode: fullscreen
   - Theme color: #ff6b35
   - Icons included
   - Installable on mobile

3. package.json - Vercel deployment config
   - For deploying to Vercel
   - Includes scripts
   - Ready for production

FORMAT YOUR RESPONSE:

```
=== FILE 1: index.html ===
[complete code here]
```

```
=== FILE 2: manifest.json ===
[complete code here]
```

```
=== FILE 3: package.json ===
[complete code here]
```

NOW GENERATE ALL 3 FILES - COMPLETE, PRODUCTION-READY CODE.
