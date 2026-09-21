import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { routePaths } from '@core/config'

const CustomerSupport = lazy(() => import('./pages/CustomerSupport/CustomerSupport'))

export const customerSupportRoutes: RouteObject[] = [
  { path: routePaths.support, element: <CustomerSupport /> }
]
