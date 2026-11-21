import { useEffect, useState } from "react";

function App() {
  // stringを保存できる状態(state)を作り、最初は空文字にする
  // setMemoでmemoを変更できる
  const [memo, setMemo] = useState<string>("");

  // 追加されたメモ一覧　配列で管理
  const [memos, setMemos] = useState<string[]>([]);

  // APIからメモ取得（バックエンドからAPI経由でフロントへ）
  async function fetchMemos() {
    try {
      const response = await fetch("http://localhost:3001/memos");

      // httpエラーで例外
      if (!response.ok) {
        throw new Error("メモ取得失敗");
      }

      // JSONをjsに変換(描画するため)
      const data: string[] = await response.json();

      // 取得メモでReactの描画
      setMemos(data);
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


  // メモ追加関数
  // いろんな処理をまとめてるから関数にしてる
  function addMemo() {
    // 空　スペースなら追加しない
    if (memo.trim() === "") return;

    // 既存の配列にメモ追加
    // ...はすべてを展開するスプレッド構文という
    setMemos([...memos, memo]);
    // 入力欄を空に
    setMemo("");
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

      <h2>メモ一覧</h2>

      {/* 配列のメモを1件ずつ表示 mapを用いて */}
      <ul>
        {memos.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );


}
export default App;