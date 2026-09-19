import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { isStaffRole } from '@core/auth'
import { routePaths } from '@core/config'
import { Loader } from '@shared/components'
import { useAuthStore } from '@store/index'

/** Customer-only routes. Staff are redirected to their own dashboard. */
export const CustomerRoute = () => {
  const location = useLocation()
  const { isAuthenticated, isBootstrapping, user } = useAuthStore()

  if (isBootstrapping) return <Loader fullPage label="Checking your session" />

  if (!isAuthenticated || !user) {
    return <Navigate to={routePaths.auth.login} state={{ from: location.pathname }} replace />
  }

  if (isStaffRole(user.role)) return <Navigate to={routePaths.staff.dashboard} replace />

  // Incomplete registration redirect for services
  const isDashboardOrProfile =
    location.pathname === routePaths.dashboard ||
    location.pathname === routePaths.auth.register ||
    location.pathname === routePaths.registration ||
    location.pathname === routePaths.auth.createProfile ||
    location.pathname === routePaths.customerType ||
    location.pathname === routePaths.profile

  if (!user.isProfileComplete && !isDashboardOrProfile) {
    return (
      <Navigate
        to={routePaths.dashboard}
        state={{ returnTo: location.pathname, openProfileModal: true }}
        replace
      />
    )
  }

  return <Outlet />
}
