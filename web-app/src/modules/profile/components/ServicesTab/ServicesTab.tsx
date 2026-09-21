import { Link } from 'react-router-dom'
import { routePaths } from '@core/config'
import './ServicesTab.css'

export const ServicesTab = () => {
  const services = [
    { title: 'My Applications', desc: 'Track your ongoing applications', to: routePaths.applications, color: '#f59e0b', bg: '#fef3c7' },
    { title: 'My Documents', desc: 'View your uploaded documents', to: routePaths.documents, color: '#3b82f6', bg: '#e0f2fe' },
    { title: 'Payments & Invoices', desc: 'View billing and transactions', to: routePaths.payments, color: '#14b8a6', bg: '#ccfbf1' },
    { title: 'Notifications', desc: 'Alerts and messages', to: routePaths.notifications, color: '#f97316', bg: '#ffedd5' },
  ]

  return (
    <div className="services-tab__grid">
      {services.map(srv => (
        <Link key={srv.title} to={srv.to} className="services-tab__card">
          <div className="services-tab__icon" style={{ backgroundColor: srv.bg }}>
            <div style={{ width: 24, height: 24, backgroundColor: srv.color, borderRadius: '50%' }}></div>
          </div>
          <div className="services-tab__content">
            <h4 className="services-tab__title">{srv.title}</h4>
            <p className="services-tab__desc">{srv.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
