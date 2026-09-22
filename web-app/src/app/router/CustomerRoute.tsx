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

  // Incomplete registration: allow browsing service hubs and account pages
  const isAllowedBrowsePath =
    location.pathname === routePaths.dashboard ||
    location.pathname === routePaths.gst.root ||
    location.pathname === routePaths.itr.root ||
    location.pathname === routePaths.incorporation.root ||
    location.pathname === routePaths.business.root ||
    location.pathname === routePaths.loans ||
    location.pathname === routePaths.insurance ||
    location.pathname === routePaths.applications ||
    location.pathname === routePaths.documents ||
    location.pathname === routePaths.payments ||
    location.pathname === routePaths.notifications ||
    location.pathname === routePaths.support ||
    location.pathname === routePaths.profile ||
    location.pathname === routePaths.auth.register ||
    location.pathname === routePaths.registration ||
    location.pathname === routePaths.auth.createProfile ||
    location.pathname === routePaths.customerType

  if (!user.isProfileComplete && !isAllowedBrowsePath) {
    const fallbackHub = location.pathname.startsWith('/gst')
      ? routePaths.gst.root
      : location.pathname.startsWith('/itr')
      ? routePaths.itr.root
      : routePaths.dashboard

    return (
      <Navigate
        to={fallbackHub}
        state={{ returnTo: location.pathname, openProfileModal: true }}
        replace
      />
    )
  }

  return <Outlet />
}
