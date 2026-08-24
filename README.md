<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 龍虎山正一授籙管理系統

## 專案架構

網站採用上、中、下三層模組化設計：

- `components/layout/SiteHeader.tsx`：上層導覽與頁面超連結
- `pages/`：中層頁面內容，每個頁面各自獨立
- `components/layout/SiteFooter.tsx`：下層頁腳
- `components/ordination/`：錄籍頁內的表單、職牒與報號元件
- `hooks/useOrdinationManager.ts`：資料與操作邏輯
- `styles/`：基礎、版面、錄籍、清冊及響應式樣式分檔

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`
