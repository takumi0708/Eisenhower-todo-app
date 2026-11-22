// Prismaが使う設定ファイル


import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma CLIにDB設定を伝える
export default defineConfig({
    // DBの設計図
    schema: "prisma/schema.prisma",

    // マイグレーションファイルの保存先
    migrations: {
        path: "prisma/migrations",
    },

    // SQLiteの接続先
    datasource: {
        url: env("DATABASE_URL"),
    },
});

