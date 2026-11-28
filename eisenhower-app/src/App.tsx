import { useEffect, useState } from "react";

import type { Memo } from "./types/memo";

function App() {
  // stringを保存できる状態(state)を作り、最初は空文字にする
  // setMemoでmemoを変更できる
  const [memo, setMemo] = useState<string>("");

  // 追加されたメモ一覧　配列で管理
  const [memos, setMemos] = useState<Memo[]>([]);

  // エラーメッセージ
  const [error, setError] = useState<string>("");

  // 現在編集中のメモID
  // editingId = 3なら3を編集中
  const [editingId, setEditingId] = useState<number | null>(null);

  // 編集中の入力欄の文字列
  const [editText, setEditText] = useState<string>("");

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

  // ==============================
  // DELETE：指定したメモを削除
  // ==============================
  async function deleteMemo(id: number) {
    try {
      // Expressにリクエスト送信
      const response = await fetch(
        `http://localhost:3001/memos/${id}`,
        {
          method: "DELETE",
        }
      );

      // 通信結果のチェック
      if (!response.ok) {
        throw new Error("削除に失敗");
      }

      // 最新メモ取得
      await fetchMemos();
    } catch (error) {
      console.log("DELETE エラー", error);
      setError("メモを削除できませんでした");
    }
  }

  // ==================================
  // 編集モードを開始
  // ==================================
  function startEdit(id: number, text: string) {

    // 編集対象のID記録
    setEditingId(id);

    // 現在のメモ本文を入力欄にセット
    // これはなくてもいいけどわかりやすいよね
    setEditText(text);
  }

  // ==================================
  // PUT：編集内容をDBに保存
  // ==================================
  async function updateMemo(id: number) {

    // 空文字は送信しない
    if (editText.trim() === "") return;

    try {

      const response = await fetch(
        `http://localhost:3001/memos/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          // 新しい本文をJSON文字列に変換
          body: JSON.stringify({
            text: editText,
          }),
        }
      );

      // 通信の結果のチェック
      if (!response.ok) {
        throw new Error("メモの更新に失敗");
      }

      // 編集モード終了
      setEditingId(null);
      setEditText("");

      // 最新のメモ一覧を取得
      await fetchMemos();
    } catch (error) {
      console.log("PUTエラー", error);
      setError("メモを更新できませんでした");
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
      <ul className="memo-list">
        {memos.map((item) => (
          <li key={item.id} className="memo-item">

            {/* このメモが編集中かどうかで表示を変える */}
            {editingId === item.id ? (
              // 編集中：入力欄と保存ボタンを表示
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />

                <div className="memo-actions">

                  <button onClick={() => updateMemo(item.id)}>
                    保存
                  </button>

                  <button onClick={() => setEditingId(null)}>
                    キャンセル
                  </button>

                </div>

              </>
            )
              :
              (
                // 通常時：本文と編集・削除ボタンを表示する
                <>
                  <span className="memo-text">
                    {item.text}
                  </span>


                  <div className="memo-actions">
                    <button onClick={() => startEdit(item.id, item.text)}>
                      編集
                    </button>

                    <button onClick={() => deleteMemo(item.id)}>
                      削除
                    </button>
                  </div>

                </>
              )
            }

          </li>
        ))}
      </ul>
    </div>
  );



}
export default App;