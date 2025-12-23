import React from 'react'
import { RouteObject } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { MenuScanPage } from './pages/MenuScanPage'
import { MenuDetailPage } from './pages/MenuDetailPage'
import { OrderCardPage } from './pages/OrderCardPage'

/**
 * Application routing configuration
 *
 * Routes:
 * - / : Home page (landing)
 * - /scan : Menu scanning page
 * - /menu : Menu detail page (with order selection)
 * - /order-card : Order card page (review and share)
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/scan',
    element: <MenuScanPage />,
  },
  {
    path: '/menu',
    element: <MenuDetailPage />,
  },
  {
    path: '/order-card',
    element: <OrderCardPage />,
  },
  {
    path: '*',
    element: <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">404 - Page Not Found / 頁面不存在</h1>
        <a href="/" className="text-indigo-600 hover:text-indigo-700">
          Go back to home / 返回首頁
        </a>
      </div>
    </div>,
  },
]
