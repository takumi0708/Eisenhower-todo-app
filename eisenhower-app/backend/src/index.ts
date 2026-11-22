import express from "express";
import cors from "cors"; // Reactから別ポートAPIにアクセスできる

// DB接続用のPrismaを読み込む
import { prisma } from "./db";
import { error } from "node:console";



// Expressアプリを作成
const app = express();

// サーバーのポート番号
const PORT = 3001;

// Reactとの通信
// originから来たURL（フロントエンド）を別ポートに許可するcorsがいて
// それをexpress のAPIでuseしてるイメージ
app.use(cors({ origin: "http://localhost:5173" }));

// JSON形式のリクエストを読み取る
app.use(express.json());

// // 今回はまだDB使わず配列
// // これはメモリ上なので揮発性
// const memos: string[] = [
//     "learn ts",
//     "learn react",
// ];


// ==================================
// GET：DBからメモ一覧を取得
// ==================================
app.get("/memos", async (req, res) => {
    // 1つ目（req）：クライアントからの要求（リクエスト）
    // 2つ目（res）：サーバーからの返答（レスポンス）
    // メモの配列をJSONで/memosの画面に返す
    try {
        // / DBのMemoテーブルを全権取得
        // findManyで複数取得
        // オブジェクトを引数にしてるから{}
        // ここにSQLっぽい指定を入れれる
        const memos = await prisma.memo.findMany({
            orderBy: { id: "asc" },
        });

        // JSONでReactに返す
        res.json(memos);
    } catch (error) {
        console.log("GETエラー", error);

        res.status(500).json({
            error: "メモ取得失敗",
        });
    }


});



// ==================================
// POST：DBに新しいメモを保存
// ==================================

// local/memosにPOSTが来た時の処理
app.post("/memos", async (req, res) => {

    // Reactから来たJSONのtext取得
    const text: unknown = req.body?.text;

    // 文字列でない、空の時
    if (typeof text !== "string" || text.trim() === "") {

        // HTTPステータスコード 400（Bad Request)
        // エラー理由をJSONで（統一してるだけ）
        res.status(400).json({
            error: "メモ入力してください",
        })
        return;
    }

    try {
        // DBのMemoに新たな行を追加
        const newMemo = await prisma.memo.create({
            data: {
                text: text.trim(),
            },
        });

        // 保存メモをReactに返す
        res.status(201).json(newMemo);
    } catch (error) {
        console.log("POST エラー", error);

        res.status(500).json({
            error: "メモの保存に失敗",
        });
    }
});

// サーバーを起動する(3001を開放)
//listen メソッドは、Express で作ったサーバー（app）に対して、
// 「指定したポート番号（今回の PORT = 3001）でアクセスを待ち受け始めなさい！」と命令するための関数
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});