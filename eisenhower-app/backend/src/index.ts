import express from "express";
import cors from "cors"; // Reactから別ポートAPIにアクセスできる
import { expectFailure } from "node:test";
import { listen } from "node:quic";
// 5173ポート（フロントエンド）からAPIで3001ポート（バックエンド）へ移動など 

// Expressアプリを作成
const app = express();

// サーバーのポート番号
const PORT = 3001;

// Reactとの通信
// originから来たURL（フロントエンド）を別ポートに許可するcorsがいて
// それをexpress のAPIでuseしてるイメージ
app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json());

// 今回はまだDB使わず配列
const memos: string[] = [
    "learn ts",
    "learn react",
];

// GET / memosにアクセスされたとき(by react)
app.get("/memos", (req, res) => {
    // 1つ目（req）：クライアントからの要求（リクエスト）
    // 2つ目（res）：サーバーからの返答（レスポンス）
    // メモの配列をJSONで/memosの画面に返す
    res.json(memos);

});

// サーバーを起動する(3001を開放)
//listen メソッドは、Express で作ったサーバー（app）に対して、
// 「指定したポート番号（今回の PORT = 3001）でアクセスを待ち受け始めなさい！」と命令するための関数
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})