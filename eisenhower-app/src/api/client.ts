// 共通の通信処理を実装

// バックエンドのURL
const BASE_URL = "http://localhost:3001";

// ==========================================
// すべてのHTTP通信に共通する処理
// ==========================================

// (): 引数
// <>: 型
async function request<T>(
    path: String,
    options: RequestInit = {}
): Promise<T> {

    // 指定したURLにhttpリクエスト
    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,

        // 送信データの形式をJSONに統一
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });


    // http通信が失敗した場合
    if (!response.ok) {
        throw new Error(`通信エラー: ${response.status}`);
    }

    // jsonをjsのデータに変換
    return (await response.json()) as T;
}