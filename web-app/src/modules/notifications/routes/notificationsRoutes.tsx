import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { routePaths } from '@core/config'

const NotificationsPage = lazy(() => import('../pages/NotificationsPage'))

export const notificationsRoutes: RouteObject[] = [
  {
    path: routePaths.notifications,
    element: <NotificationsPage />,
  },
]
