import { useIncorporation } from '../../hooks/useIncorporation'
import type { IncorporationEntityType } from '../../types/incorporation.types'
import './Incorporation.css'

export const Incorporation = () => {
  const {
    services,
    processSteps,
    stats,
    applications,
    selectedType,
    setSelectedType,
    nameCheckQuery,
    setNameCheckQuery,
    nameCheckResult,
    handleCheckName,
    clearNameCheck,
  } = useIncorporation()

  const filterTabs: Array<{ key: IncorporationEntityType | 'all'; label: string }> = [
    { key: 'all', label: 'All Structures' },
    { key: 'pvt_ltd', label: 'Private Limited' },
    { key: 'llp', label: 'LLP' },
    { key: 'opc', label: 'One Person Company' },
    { key: 'section_8', label: 'Section 8 (NGO)' },
    { key: 'public_ltd', label: 'Public Limited' },
    { key: 'proprietorship', label: 'Proprietorship' },
  ]

  return (
    <div className="inc-page">
      {/* 1. Hero Section with MCA Name Availability Search */}
      <section className="inc-hero">
        <div className="inc-hero__badge">Ministry of Corporate Affairs (MCA) Registration</div>
        <h1 className="inc-hero__title">Company & LLP Incorporation in India</h1>
        <p className="inc-hero__subtitle">
          Incorporate your Private Limited Company, LLP, or OPC in under 7 business days with end-to-end Chartered Accountant & Company Secretary assistance.
        </p>

        <div className="inc-hero__search-card">
          <div className="inc-hero__search-label">
            <span>🔍 Free MCA Company Name Availability Screening</span>
          </div>
          <div className="inc-hero__search-row">
            <input
              type="text"
              className="inc-hero__input"
              placeholder="Enter your proposed company name (e.g. ZenScale Solutions)..."
              value={nameCheckQuery}
              onChange={(e) => setNameCheckQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCheckName()
              }}
            />
            <button type="button" className="inc-hero__btn-check" onClick={handleCheckName}>
              Check Name Availability
            </button>
          </div>

          {nameCheckResult && (
            <div
              className={`inc-hero__search-result ${
                nameCheckResult.available ? 'inc-hero__search-result--success' : 'inc-hero__search-result--warning'
              }`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{nameCheckResult.message}</strong>
                <button
                  type="button"
                  onClick={clearNameCheck}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                >
                  ✕
                </button>
              </div>

              {nameCheckResult.suggestions.length > 0 && (
                <div className="inc-hero__suggestions">
                  {nameCheckResult.suggestions.map((item) => (
                    <span key={item} className="inc-hero__suggestion-tag">
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 2. Key Metrics Bar */}
      <section className="inc-stats-grid">
        <div className="inc-stat-card">
          <p className="inc-stat-card__val">{stats.totalEntitiesRegistered.toLocaleString('en-IN')}+</p>
          <p className="inc-stat-card__label">Companies Incorporated</p>
        </div>
        <div className="inc-stat-card">
          <p className="inc-stat-card__val">{stats.avgTurnaroundDays} Days</p>
          <p className="inc-stat-card__label">Average MCA Approval Time</p>
        </div>
        <div className="inc-stat-card">
          <p className="inc-stat-card__val">{stats.rocApprovalRate}</p>
          <p className="inc-stat-card__label">First-Attempt ROC Approval</p>
        </div>
        <div className="inc-stat-card">
          <p className="inc-stat-card__val">{stats.activeSupportHours}</p>
          <p className="inc-stat-card__label">Compliance Consultation</p>
        </div>
      </section>

      {/* 3. Entity Type Selection & Filter Pills */}
      <section className="inc-filter-bar">
        <div className="inc-filter-pills">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`inc-filter-pill ${selectedType === tab.key ? 'inc-filter-pill--active' : ''}`}
              onClick={() => setSelectedType(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Incorporation Services Card Grid */}
      <section className="inc-services-grid">
        {services.map((service) => (
          <div className="inc-card" key={service.id}>
            {service.badge && <span className="inc-card__badge">{service.badge}</span>}

            <div className="inc-card__icon-wrap">{service.icon}</div>

            <h3 className="inc-card__title">{service.title}</h3>
            <p className="inc-card__subtitle">{service.subtitle}</p>

            <div className="inc-card__price-row">
              <span className="inc-card__price">{service.price}</span>
              <span className="inc-card__timeline">· {service.turnaroundTime}</span>
            </div>

            <ul className="inc-card__features">
              {service.features.map((feature) => (
                <li key={feature} className="inc-card__feature-item">
                  <span className="inc-card__feature-check">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="inc-card__btn"
              onClick={() => alert(`Initiating registration for ${service.title}. A TaxEdge specialist will assist with documents.`)}
            >
              Start {service.title} →
            </button>
          </div>
        ))}
      </section>

      {/* 5. 4-Stage MCA Workflow Timeline */}
      <section className="inc-process-section">
        <div className="inc-process__header">
          <h2 className="inc-process__title">How Government Incorporation Works</h2>
          <p className="inc-process__subtitle">
            From preliminary name reservation to final Certificate of Incorporation issuance via SPICe+
          </p>
        </div>

        <div className="inc-process__grid">
          {processSteps.map((step) => (
            <div className="inc-process-step" key={step.stepNumber}>
              <div className="inc-process-step__num">{step.stepNumber}</div>
              <h4 className="inc-process-step__title">{step.title}</h4>
              <p className="inc-process-step__desc">{step.description}</p>
              <span className="inc-process-step__badge">{step.duration}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Active Applications Tracker */}
      <section className="inc-apps-section">
        <h2 className="inc-process__title">Your Incorporation Dossiers</h2>
        <p className="inc-process__subtitle">Real-time status tracking for filed ROC applications</p>

        <table className="inc-apps-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Proposed Entity Name</th>
              <th>Status</th>
              <th>Current Stage</th>
              <th>Target Date</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td><strong>{app.referenceNumber}</strong></td>
                <td>{app.proposedName}</td>
                <td>
                  <span className={`inc-status-tag ${app.status === 'IN_REVIEW' ? 'inc-status-tag--review' : 'inc-status-tag--approved'}`}>
                    {app.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td>{app.currentStep}</td>
                <td>{app.targetCompletionDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default Incorporation
