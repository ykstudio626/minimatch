export default function Loader() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm">
        <div className="flex flex-col items-center gap-6">
          {/* スピニングローダー */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin"></div>
          </div>

          {/* テキスト */}
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800">マッチング中...</p>
            <p className="text-sm text-gray-600 mt-2">AIが最適な人材を探索しています</p>
          </div>

          {/* プログレスバー */}
          <div className="w-full">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>処理進捗</span>
              <span>処理中</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* ドット */}
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
