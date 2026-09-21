import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { routePaths } from '@core/config'

const Incorporation = lazy(() => import('./pages/Incorporation/Incorporation'))

export const incorporationRoutes: RouteObject[] = [
  {
    path: routePaths.incorporation.root,
    element: <Incorporation />,
  },
]
