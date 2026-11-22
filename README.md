# Full Stack Memo App
React・TypeScript・Node.js・SQLiteを用いて開発した、フルスタックWebアプリの学習用プロジェクトです。

## 開発目的
フロントエンド・バックエンド・データベースの役割と、HTTP通信によるデータの流れを理解すること。

## 技術スタック
|分野|技術|
|---|---|
| フロント | React, TypeScript, Vite | 
| バックエンド | Node.js, Express, TypeScript | 
| DB | SQLite |
| ORM(Object-Relational Mapping) | Prisma | 

## 主な機能

- メモの追加（POST）

- メモの一覧表示（GET）

- メモの編集（PUT）

- メモの削除（DELETE）

- SQLiteによるデータの永続保存

## 起動方法
### フロントエンド

```
npm install
npm run dev
```


# バックエンド（backend/）
```
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```
