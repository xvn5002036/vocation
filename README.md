<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 《新刊天壇玉格》八字查考

公開網站：https://xvn5002036.github.io/vocation/

## 專案架構

網站採用上、中、下三層模組化設計：

- `components/layout/SiteHeader.tsx`：上層導覽與頁面超連結
- `pages/`：中層頁面內容，每個頁面各自獨立
- `components/layout/SiteFooter.tsx`：下層頁腳
- `components/ordination/`：本命表單、原典結果與使用說明元件
- `hooks/useOrdinationManager.ts`：資料與操作邏輯
- `styles/`：基礎、版面、錄籍、清冊及響應式樣式分檔

## 內容依據

網站以提供的《新刊天壇玉格》簡化圖片為主要依據。使用者輸入民國農曆年月日、閏月與時辰，系統自動換算完整四柱，再依生年干支、出生年生肖、出生時辰、生日干支及農曆生日分項查考。所有結果均由當次輸入動態計算。

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`
