# 📋 COPY-PASTE THIS INTO CLAUDE (VSCode)

## Instructions:
1. Open Claude in VSCode
2. Start new chat
3. Copy everything below
4. Paste it exactly
5. Send to Claude
6. Wait for response with 3 files

---

## THE PROMPT:

```
You are a professional web developer creating a production-grade Restaurant POS system.

PROJECT NAME: Royal Spicy Restaurant - Point of Sale System

CRITICAL REQUIREMENTS:

1. DESIGN & UX:
   - White background (#ffffff)
   - Dark text (#1a1a1a) 
   - Orange accents (#ff6b35)
   - Professional restaurant appearance
   - Fullscreen app (no browser UI visible)
   - Large buttons for tablet touch (minimum 44px)
   - High contrast for easy reading
   - Responsive mobile/tablet layout

2. FEATURES - ALL MUST WORK:
   
   Dashboard Screen:
   - Display 12 restaurant tables
   - Show active orders count
   - Show today's revenue
   - Show total items sold
   - Table status (empty=gray, active=red)
   - Click table to start order
   - Reports button
   - Clear data button

   Orders Screen:
   - Full menu with 200+ items organized in categories
   - Menu categories: Veg Soup, Non-Veg Soup, Egg Starters, Veg Starters, Chicken, Sea Food, Veg Curries, Chicken Curries, Bread, Rice, Biryanis, Beverages
   - Add items with quantity control
   - Real-time bill calculation
   - Discount percentage input (0-100%)
   - GST calculation (5% on discounted amount)
   - Optional customer mobile number
   - Payment method selection (Cash, Card, UPI)
   - Preview bill button
   - Print button (sends to Bluetooth printer)
   - Bill auto-saves to localStorage

   Billing System:
   - Subtotal calculation (price × quantity)
   - Discount percentage deduction
   - GST 5% applied on discounted amount
   - Total = Subtotal - Discount + GST
   - All calculations real-time
   - Professional receipt format

   Bluetooth Printing:
   - Web Bluetooth API integration
   - Thermal printer support (2mm 80mm rolls)
   - ESC/POS format for thermal printers
   - Send receipt to connected Bluetooth printer
   - Plain text format compatible with all thermal printers
   - Auto-formatting for 80mm paper width

   Customer Tracking:
   - Optional mobile number input
   - Store customer data in localStorage
   - Track repeat customers
   - Show visit count
   - Show total amount spent
   - Show last visit date

   Reports Screen:
   - Daily revenue total
   - Average bill value
   - Total items sold
   - List of customers (mobile, visits, total spent)
   - Updated in real-time

   Data Persistence:
   - localStorage for all data
   - Orders persist between sessions
   - Customer data persists
   - No server/backend needed

3. TECHNICAL SPECIFICATIONS:
   - Single HTML file (index.html) - NO separate CSS/JS files
   - All CSS embedded in <style> tags
   - All JavaScript embedded in <script> tags
   - No external dependencies (except Google Fonts)
   - manifest.json for PWA installation
   - package.json for Vercel deployment
   - Works completely offline
   - iOS/Android compatible
   - Fullscreen on mobile (hides address bar)

4. MENU DATA (All items with exact prices from Royal Spicy):
   
   Veg Soup: Corn soup 80, Manchow soup 80, Hot & Sour 80
   Non-Veg Soup: Chicken corn soup 95, Chicken manchow 95, Chicken Hot & Sour 95
   Egg Starters: Egg 65 180, Egg manchuria 180, Egg Burgi 100, Chilli Egg 180, Egg omlet 70
   Veg Starters: Veg Manchuria 170, Gobi Manchuria 170, Gobi 65 170, Paneer 65 220, Paneer Manchuria 220, Chilli Paneer 210, Baby corn 65 180
   Chicken Starters: Chicken 65 220, Pepper Chicken 240, Chilli Chicken 220, Chicken Fry 240, Chicken 777 240, Chilli Drumsticks 240, Chicken Majestick 240, Chicken Manchuria 240, Chicken Lollipop 250, Crispy Chicken 240
   Sea Food Starters: Appollo Fish 270, Chilli Fish 270, Chilli Prawns 280, Lemon Fish 270, Prawns 65 280, Loose Prawns 280
   Tandoori Starters: Tandoori Chicken Single 200, Tandoori Chicken Full 400, Tangdi Kabab 300, Paneer Tikka 260
   Chinese Main (Veg): Soft Noodles 160, Fried Rice 160, Schezwan Fried Rice 180, Schezwan Noodles 180
   Chinese Main (Non-Veg): Egg Soft Noodles 170, Chicken Soft Noodles 190, Chicken Schezwan Noodles 200, Chicken Fried Rice 190, Chicken Schezwan Fried Rice 200, Egg Fried Rice 170, Egg Schezwan Fried Rice 180
   Veg Curries: Dal Fry 160, Dal Tadka 160, Paneer Do Pyaza 230, Paneer Butter Masala 230, Baby corn Mushroom Masala 230, Methi Chaman 200, Veg Kolhapuri 200, Aloo Zeera 180, Veg Hyderabadi 200, Aloo Mutter 180, Kadai Paneer 230, Kadai Veg 200, Veg Chatpat 190, Mix Veg Curry 190, Aloo Gobi Masala 190
   Chicken Curries: Chicken Curry 230, Chicken Masala 230, Kadai Chicken 230, Butter Chicken 230, Chicken Kolhapuri 250, Chicken Hyderabadi 250, Telangana Chicken Curry 250, Chef Spl Chicken Curry 250, Chicken Tangdi Masala 280, Murg Musallam 450, Chicken Afghani 250, Chicken Mughalai 280
   Egg Curries: Egg Masala 180, Egg Curry 180
   Mutton Curries: Mutton Masala 320, Mutton Curry 320, Mutton Rogan Josh 320, Telangana Mutton Curry 320
   Sea Food Curries: Fish Curry 280, Fish Masala 280, Prawns Curry 280, Prawns Masala 280
   Bread Basket: Phulka 20, Chapathi 25, Tandoor Roti 30, Plain Naan 35, Butter Naan 40, Garlic Naan 50, Butter Roti 35, Rumali Roti 30, Aloo Paratha 80, Masala Papad 45
   Rice: Plain Rice 80, Lemon Rice 120, Tomato Rice 140, Zeera Rice 120, Curd Rice 120, Dal Kichdi Single 150, Dal Kichdi Full 250
   Veg Biryanis: Veg Biryani Single 140, Kaju Biryani 200, Paneer Biryani 200, Gongura Veg Biryani 190, Veg Biryani Full 200, Avakaya Veg Biryani 190, Ulavacharu Veg Biryani 200, Mushroom Biryani 200
   Non-Veg Biryanis: Biryani Rice 100, Chicken mini biryani 150, Chicken Dum Biryani Full 250, Chicken Fry piece Biryani Single 150, Chicken Fry piece Biryani Full 250, Chicken Spl Biryani Single 150, Chicken Spl Biryani Full 250, Gongura Chicken Biryani 250, Avakaya Chicken Biryani 250, Ulavacharu Chicken Biryani 260, Mutton Biryani 300, Gongura Mutton Biryani 310, Avakaya Mutton Biryani 310, Ulavacharu Mutton Biryani 320, Fish Biryani 280, Prawns biryani 280
   Family Packs: Chicken Dum Family pack 600, Chicken Spl Family pack 600, Chicken Fry Piece Family pack 600, Veg Family pack 400, Mutton Family pack 670, Chicken Dum Jumbo 700, Chicken Spl Jumbo 700, Chicken Fry Piece Jumbo 700, Mutton Jumbo 800
   Beverages: Water Bottle 20, Soft Drink 20, Lassi Sweet 50, Butter Milk 50, Fresh Lime Soda 50, Masala Cool Drink 50, Gulab Jamun 2pc 60

5. RESTAURANT INFO:
   - Name: ROYAL SPICY RESTAURANT
   - Phone: +91 88979 31711 / +91 98852 34008
   - Address: No. 1-57/37 & 1-58/106, Kondapur Road, Beside Zilla Parishad School, P Janardhan Reddy Nagar, Gachibowli, Hyderabad, Telangana - 500032

6. DELIVERABLES:
   You must provide 3 complete, production-ready files:
   
   FILE 1: index.html
   - Complete, self-contained HTML file
   - All CSS in <style> tags
   - All JavaScript in <script> tags
   - Ready to open directly in browser
   - ~2500 lines of polished code
   
   FILE 2: manifest.json
   - PWA manifest for app installation
   - App name, icons, colors
   - Fullscreen display mode
   
   FILE 3: package.json
   - For Vercel deployment
   - Node.js project config
   - Scripts for Vercel

7. OUTPUT FORMAT:
   First: Show complete index.html with all code
   Then: Show manifest.json
   Then: Show package.json
   
   Label each file clearly:
   ```
   === FILE: index.html ===
   [complete code]
   ```
   
   ```
   === FILE: manifest.json ===
   [complete code]
   ```
   
   ```
   === FILE: package.json ===
   [complete code]
   ```

NOW GENERATE THE COMPLETE PRODUCTION-READY POS SYSTEM WITH ALL 3 FILES.
```

---

## After Claude Responds:

1. **Copy the index.html code**
   - Click in VSCode file `index.html`
   - Paste entire code
   - Save

2. **Copy manifest.json**
   - Click in VSCode file `manifest.json`
   - Paste code
   - Save

3. **Copy package.json**
   - Click in VSCode file `package.json`
   - Paste code
   - Save

4. **Test locally** - Right-click index.html → Open with Live Server

5. **Ready for Vercel!** - Follow deployment guide below
