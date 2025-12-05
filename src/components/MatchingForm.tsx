import React, { useState } from 'react';
import type { FormData, MatchingResult, MatchingResponse } from '../types';
import Loader from './Loader';

const API_KEY = "app-RAu9ngTst03pgJXVXrRJgd0Q";
const DIFY_URL = "https://api.dify.ai/v1/workflows/run";

interface MatchingFormProps {
  onResultsReceived: (results: MatchingResult[], recommendedActions: string[]) => void;
}

export default function MatchingForm({ onResultsReceived }: MatchingFormProps) {
  const [formData, setFormData] = useState<FormData>({
    案件名: '',
    必須スキル: '',
    単価: '',
    勤務地および勤務形態: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setFormData({
      案件名: '',
      必須スキル: '',
      単価: '',
      勤務地および勤務形態: '',
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // フォームデータをJSONに変換（構造化データとして）
      const ankenData = {
        案件名: formData.案件名,
        必須スキル: formData.必須スキル,
        単価: formData.単価,
        勤務地および勤務形態: formData.勤務地および勤務形態,
      };

      // DIFY API の仕様に従ったペイロード
      const payload = {
        inputs: {
          action: "matching_yoin",
          anken: JSON.stringify(ankenData),
          text: "dummy"
        },
        response_mode: "blocking",
        user: "mini_match_user"
      };

      console.log("Sending payload:", payload);

      const response = await fetch(DIFY_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      const responseText = await response.text();
      console.log("Response body:", responseText);

      if (!response.ok) {
        let errorMessage = response.statusText;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // JSONパースに失敗した場合は元のテキストを使用
          errorMessage = responseText || errorMessage;
        }
        throw new Error(`API Error (${response.status}): ${errorMessage}`);
      }

      const data = JSON.parse(responseText);

      // レスポンスからテキストを抽出してパース
      if (data.data && data.data.outputs && data.data.outputs.text) {
        const textContent = data.data.outputs.text;
        console.log("Text content:", textContent);
        console.log("Text content type:", typeof textContent);
        
        let parsedResponse: MatchingResponse;
        
        // textContentが文字列の場合はJSONパースする
        if (typeof textContent === 'string') {
          try {
            parsedResponse = JSON.parse(textContent);
          } catch (parseErr) {
            console.error("JSON parse error:", parseErr);
            throw new Error("レスポンスのJSONパースに失敗しました");
          }
        } else {
          // すでにオブジェクト/配列の場合
          parsedResponse = textContent;
        }

        // candidatesが存在するか確認
        if (!parsedResponse.candidates || !Array.isArray(parsedResponse.candidates)) {
          console.error("candidates is not an array:", parsedResponse);
          throw new Error("マッチング結果（candidates）は配列である必要があります");
        }

        // 日時フォーマットの変換と結果の処理
        const formattedResults = parsedResponse.candidates.map((result) => ({
          ...result,
          受信日時: formatDateTime(result.受信日時),
        }));

        // 推奨アクションを取得
        const recommendedActions = parsedResponse.推奨アクション || [];

        onResultsReceived(formattedResults, recommendedActions);
      } else {
        console.error("Invalid response structure:", data);
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (isoDateTime: string): string => {
    const date = new Date(isoDateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
  };

  return (
    <>
      {isLoading && <Loader />}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* フォーム */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">案件情報を入力して下さい</h2>

            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 案件名 */}
            <div>
              <label htmlFor="案件名" className="block text-sm font-semibold text-gray-700 mb-2">
                案件名
              </label>
              <input
                type="text"
                id="案件名"
                name="案件名"
                value={formData.案件名}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例：在庫管理システム開発"
                required
              />
            </div>

            {/* 必須スキル */}
            <div>
              <label htmlFor="必須スキル" className="block text-sm font-semibold text-gray-700 mb-2">
                必須スキル
              </label>
              <input
                type="text"
                id="必須スキル"
                name="必須スキル"
                value={formData.必須スキル}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例：Java,Spring Boot,AWS EC2,RDS,PostgreSQL"
                required
              />
            </div>

            {/* 単価 */}
            <div>
              <label htmlFor="単価" className="block text-sm font-semibold text-gray-700 mb-2">
                単価
              </label>
              <input
                type="text"
                id="単価"
                name="単価"
                value={formData.単価}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例：70-80万"
                required
              />
            </div>

            {/* 勤務地および勤務形態 */}
            <div>
              <label htmlFor="勤務地および勤務形態" className="block text-sm font-semibold text-gray-700 mb-2">
                勤務地および勤務形態
              </label>
              <input
                type="text"
                id="勤務地および勤務形態"
                name="勤務地および勤務形態"
                value={formData.勤務地および勤務形態}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例：品川駅、リモート併用"
                required
              />
            </div>

            {/* ボタン */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                {isLoading ? "処理中..." : "見合う要員を探す"}
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                className="flex-1 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                クリア
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* サイドバー（ヘルプテキスト） */}
      <div className="lg:col-span-1">
        <div className="bg-blue-50 rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4">入力例</h3>
          <div className="space-y-4 text-sm text-blue-800">
            <div>
              <p className="font-semibold">案件名</p>
              <p>在庫管理システム開発</p>
            </div>
            <div>
              <p className="font-semibold">必須スキル</p>
              <p>Java,Spring Boot,AWS EC2,RDS,PostgreSQL</p>
            </div>
            <div>
              <p className="font-semibold">単価</p>
              <p>70-80万</p>
            </div>
            <div>
              <p className="font-semibold">勤務地および勤務形態</p>
              <p>新宿駅、リモート併用</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
