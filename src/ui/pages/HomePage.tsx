/**
 * HomePage Component
 * Landing page for KoreKore application
 *
 * Features:
 * - Application introduction
 * - Prominent upload/photo button
 * - Navigation to menu scanning
 */

import { useNavigate } from 'react-router-dom'

/**
 * HomePage Component
 *
 * Displays KoreKore welcome screen with prominent
 * call-to-action button for menu scanning.
 *
 * @returns React component
 */
export function HomePage() {
  const navigate = useNavigate()

  const handleStartScanning = () => {
    navigate('/menu-scan')
  }

  return (
    <div
      data-testid="home-page"
      className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 flex flex-col items-center justify-center p-4"
    >
      {/* Decorative background element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl text-center">
        {/* Logo/Title */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-2">
            KoreKore
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            日本餐廳菜單翻譯 AI 工具
          </p>
          <p className="text-gray-500 mt-2">
            不懂日文？只需拍照。
          </p>
        </div>

        {/* Main Description */}
        <div className="mb-12 text-left space-y-4">
          <p className="text-gray-700 text-lg">
            在日本餐廳點餐不再困擾！KoreKore 幫你：
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-2xl text-orange-500">📸</span>
              <span>
                <strong>拍攝菜單</strong>
                <br />
                用手機拍一張菜單照片
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl text-orange-500">🤖</span>
              <span>
                <strong>AI 秒解析</strong>
                <br />
                自動翻譯並提取菜名、價格和描述
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl text-orange-500">✍️</span>
              <span>
                <strong>點餐卡生成</strong>
                <br />
                生成給店員看的日文點餐文字
              </span>
            </li>
          </ul>
        </div>

        {/* Main CTA Button */}
        <button
          onClick={handleStartScanning}
          className="w-full md:w-auto px-12 py-5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg md:text-xl font-bold rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 mb-6 flex items-center justify-center gap-3"
          data-testid="start-scanning-button"
        >
          <span className="text-2xl">📸</span>
          上傳菜單照片或拍照
        </button>

        {/* Secondary Info */}
        <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-orange-500">20+</p>
            <p className="text-sm text-gray-600">菜單項目</p>
          </div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-orange-500">
              即時
            </p>
            <p className="text-sm text-gray-600">AI 解析</p>
          </div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-orange-500">
              100%
            </p>
            <p className="text-sm text-gray-600">離線支援</p>
          </div>
        </div>

        {/* Features Highlight */}
        <div className="mt-12 bg-white bg-opacity-60 backdrop-blur-sm rounded-lg p-6 border border-orange-100">
          <p className="text-sm text-gray-600 mb-3">
            <strong>功能特色：</strong>
          </p>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>✓ 支援 JPG、PNG 圖片</li>
            <li>✓ 自動壓縮大檔案 (無損品質)</li>
            <li>✓ 即時進度反饋</li>
            <li>✓ 響應式設計，手機最佳化</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center text-gray-500 text-sm">
        <p>Made with ❤️ for travelers in Japan</p>
      </footer>
    </div>
  )
}
