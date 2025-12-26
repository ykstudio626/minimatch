import type { MatchingResult } from '../types';

interface ResultsDisplayProps {
  results: MatchingResult[];
  recommendedActions: string[];
  onBackToForm: () => void;
}

export default function ResultsDisplay({ results, recommendedActions, onBackToForm }: ResultsDisplayProps) {
  const getMatchScore = (result: MatchingResult): number => {
    const matchScore = result["案件とのマッチ度（100点満点）"];
    return typeof matchScore === 'string' ? parseInt(matchScore, 10) : matchScore;
  };

  const averageScore = results.length > 0 
    ? Math.round(results.reduce((sum, r) => sum + getMatchScore(r), 0) / results.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">マッチング結果数</p>
          <p className="text-4xl font-bold text-blue-600">{results.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">平均マッチ度</p>
          <p className="text-4xl font-bold text-green-600">{averageScore}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <button
            onClick={onBackToForm}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            フォームへ戻る
          </button>
        </div>
      </div>

      {/* マッチング結果カード */}
      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            {/* ヘッダー */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <p className="text-sm opacity-90">要員ID</p>
                  <p className="text-2xl font-bold">{result.要員ID}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90">マッチ度</p>
                  <p className="text-3xl font-bold">{getMatchScore(result)}%</p>
                </div>
              </div>
            </div>

            {/* ボディ */}
            <div className="p-6 space-y-6">
              {/* 受信日時 */}
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-600">受信日時</p>
                <p className="text-lg font-semibold text-gray-800">{result.受信日時}</p>
              </div>

              {/* 要員情報 */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="text-lg font-bold text-gray-800 mb-4">要員情報</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">氏名</p>
                    <p className="font-semibold text-gray-800">{result.要員情報.氏名}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">最寄駅</p>
                    <p className="font-semibold text-gray-800">{result.要員情報.最寄駅}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">スキル</p>
                    <p className="font-semibold text-gray-800">{result.要員情報.スキル}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">希望勤務形態</p>
                    <p className="font-semibold text-gray-800">{result.要員情報.希望勤務形態}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">備考</p>
                    <p className="text-gray-800">{result.要員情報.備考}</p>
                  </div>
                </div>
              </div>

              {/* 理由コメント */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-sm text-gray-600 mb-2">理由コメント</p>
                <p className="text-gray-800 leading-relaxed">{result.理由コメント}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 全体推奨アクション */}
      {recommendedActions.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">全体推奨アクション</h3>
          <ul className="space-y-3">
            {recommendedActions.map((action, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-gray-800 text-base">{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* フッター */}
      <div className="flex justify-center mt-8">
        <button
          onClick={onBackToForm}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 text-lg"
        >
          フォームへ戻る
        </button>
      </div>
    </div>
  );
}
