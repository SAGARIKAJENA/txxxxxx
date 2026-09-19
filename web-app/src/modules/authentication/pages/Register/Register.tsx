import { Navigate } from 'react-router-dom'
import { routePaths } from '@core/config'
import { useAuthStore } from '@store/index'
import { AuthIdentityHeroPanel } from '../../components/AuthIdentityHeroPanel/AuthIdentityHeroPanel'
import { RegistrationCard } from '../../components/RegistrationCard/RegistrationCard'
import './Register.css'

export const Register = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)

  if (!isAuthenticated) {
    return <Navigate to={routePaths.auth.login} replace />
  }

  if (user?.isProfileComplete) {
    return <Navigate to={routePaths.dashboard} replace />
  }
  return (
    <div className="register-screen">
      {/* Left 45% Stage: Branded Identity Hero Panel */}
      <section className="register-screen__left">
        <AuthIdentityHeroPanel />
      </section>

      {/* Center Dividing Vertical Line with Glowing Orange Ring Node */}
      <div className="register-screen__center-divider" aria-hidden="true">
        <div className="register-screen__divider-line" />
        <div className="register-screen__divider-node" />
      </div>

      {/* Right 55% Stage: White Card */}
      <aside className="register-screen__right">
        <div className="register-screen__card-box">
          <RegistrationCard />
        </div>
      </aside>
    </div>
  )
}

export default Register

