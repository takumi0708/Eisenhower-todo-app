import { useEffect, useState } from "react";

// DBから返されるメモ1件分の型
type Memo = {
  id: number;
  text: string;
};

function App() {
  // stringを保存できる状態(state)を作り、最初は空文字にする
  // setMemoでmemoを変更できる
  const [memo, setMemo] = useState<string>("");

  // 追加されたメモ一覧　配列で管理
  const [memos, setMemos] = useState<Memo[]>([]);

  // エラーメッセージ
  const [error, setError] = useState<string>("");

  // APIからメモ取得（バックエンドからAPI経由でフロントへ）
  // GET：メモ一覧を取得してる
  async function fetchMemos() {
    try {
      const response = await fetch("http://localhost:3001/memos");

      // httpエラーで例外
      if (!response.ok) {
        throw new Error("メモ取得失敗");
      }

      // JSONをjsに変換(描画するため)
      const data: Memo[] = await response.json();

      // 取得メモでReactの描画
      setMemos(data);
      setError("");

    } catch (error) {
      console.error("API通信エラー, error");
    }

  }

  // 画面の表示後にAPI呼び出し
  useEffect(() => {
    // 画面表示直後にこの関数を１回だけ呼び出す（とりま通信見たいから）
    // 第２引数からなので１回だけ実行された時だけ実行
    fetchMemos();
  }, []);


  // POST：新たなメモを追加
  // バックエンドに行って追加
  async function addMemo() {
    // 空　スペースなら追加しない
    if (memo.trim() === "") return;

    try {
      // ExpressにPOSTリクエスト
      const response = await fetch(
        "http://localhost:3001/memos",
        {
          method: "POST",

          // このデータはJOSNだとexpressに伝える
          headers: {
            "Content-Type": "application/json",
          },

          // jsをJSONに変換
          body: JSON.stringify({
            text: memo,
          }),
        }
      );

      // 通信の確認
      if (!response.ok) {
        throw new Error("メモの追加に失敗");
      }

      setMemo("");

      // 最新のメモ一覧をサーバーから取得
      await fetchMemos();
    } catch (error) {
      console.error("POSTエラー", error);
    }
  }

  return (
    <div>
      <h1>一言メモ</h1>

      <input
        value={memo}
        // targetはHTML要素その中身のvalue
        onChange={(e) => setMemo(e.target.value)}
        placeholder="メモを入力"
      />

      {/* ボタン押されたらaddMemoを実行 */}
      <button onClick={addMemo}>
        追加
      </button>

      {/* 通信エラーあれば表示 */}
      {error && <p role="alert">{error}</p>}


      <h2>メモ一覧</h2>

      {/* 配列のメモを1件ずつ表示 mapを用いて */}
      <ul>
        {memos.map((item) => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );


}
export default App;