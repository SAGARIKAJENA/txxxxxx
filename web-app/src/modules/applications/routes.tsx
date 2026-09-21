import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { routePaths } from '@core/config'

const Applications = lazy(() => import('./pages/Applications/Applications'))
const ApplicationTrackerView = lazy(
  () => import('./components/ApplicationTracker/ApplicationTrackerView')
)

export const applicationsRoutes: RouteObject[] = [
  { path: routePaths.applications, element: <Applications /> },
  { path: '/applications/:id', element: <ApplicationTrackerView /> },
  { path: '/applications/track/:id', element: <ApplicationTrackerView /> },
]
