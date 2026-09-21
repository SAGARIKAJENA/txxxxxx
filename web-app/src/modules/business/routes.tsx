import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { routePaths } from '@core/config'

const BusinessPage = lazy(() => import('./pages/Business/Business'))

export const businessRoutes: RouteObject[] = [
  {
    path: routePaths.business.root,
    element: <BusinessPage />,
  },
]
