import "dotenv/config";

import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// .envからDBの場所取得
const databaseURL = process.env.DATABASE_URL;

if (!databaseURL) {
    // 処理を止めてエラーにする
    throw new Error("DATABASE_URLが設定されてません");
}

// SQLliteに接続するアダプター
const adapter = new PrismaBetterSqlite3({
    url: databaseURL,
})

// Prismaを使えるようにする
export const prisma = new PrismaClient({
    adapter,
})