import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { routePaths } from '@core/config/routePaths'
import type { OriginalReturnDetails, UploadedDocument, DocumentTypeId } from '../../types/revisedItr.types'
import './Step6ApplicationReceived.css'

interface Step6ApplicationReceivedProps {
  applicationId: string
  selectedAy: string
  returnDetails: OriginalReturnDetails | null
  uploadedDocuments: Partial<Record<DocumentTypeId, UploadedDocument>>
  onBack?: () => void
  onDownloadReceipt: () => void
}

interface TimelineStage {
  id: number
  title: string
  status: 'completed' | 'active' | 'upcoming'
  icon: React.ReactNode
}

export const Step6ApplicationReceived: React.FC<Step6ApplicationReceivedProps> = ({
  applicationId,
  selectedAy,
  returnDetails,
  uploadedDocuments,
  onDownloadReceipt,
}) => {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const docCount = Object.keys(uploadedDocuments).length
  const displayAy = selectedAy || returnDetails?.assessmentYear || 'AY 2025-26'

  const handleCopyId = () => {
    navigator.clipboard.writeText(applicationId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleViewStatus = () => {
    navigate(routePaths.applications)
  }

  const stages: TimelineStage[] = [
    {
      id: 1,
      title: 'Application Received',
      status: 'completed',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      id: 2,
      title: 'Payment Completed',
      status: 'completed',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
    },
    {
      id: 3,
      title: 'CA Verification',
      status: 'active',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      id: 4,
      title: 'Revised ITR Preparation',
      status: 'upcoming',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
    },
    {
      id: 5,
      title: 'Filing',
      status: 'upcoming',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      ),
    },
    {
      id: 6,
      title: 'Income Tax Processing',
      status: 'upcoming',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
      ),
    },
  ]

  return (
    <div className="step6-received-container">
      {/* Hero Success Section */}
      <section className="step6-hero-card">
        {/* Floating Celebration Particles */}
        <div className="step6-confetti-wrap" aria-hidden="true">
          <span className="step6-dot dot-orange dot-1" />
          <span className="step6-dot dot-green dot-2" />
          <span className="step6-dot dot-blue dot-3" />
          <span className="step6-dot dot-yellow dot-4" />
          <span className="step6-dot dot-purple dot-5" />
          <span className="step6-dot dot-green dot-6" />
          <span className="step6-dot dot-orange dot-7" />
          <span className="step6-dot dot-blue dot-8" />
        </div>

        {/* Outer Glow & Check Circle */}
        <div className="step6-hero-check-ring">
          <div className="step6-hero-check-circle">
            <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#16a34a" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* Hero Headline & Subtitle */}
        <h1 className="step6-hero-title">
          Your Revised ITR application has been received.
        </h1>
        <p className="step6-hero-desc">
          Your documents and revised tax information have been received. A Tax Executive will review them before preparing your return.
        </p>

        {/* Application ID Pill */}
        <div
          className="step6-app-id-pill"
          onClick={handleCopyId}
          title="Click to copy Application ID"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCopyId()}
        >
          <span className="step6-app-id-label">Application ID</span>
          <strong className="step6-app-id-val">{applicationId}</strong>
          <span className="step6-copy-icon-btn" aria-label="Copy Application ID">
            {copied ? (
              <span className="step6-copied-tooltip">Copied!</span>
            ) : (
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </span>
        </div>
      </section>

      {/* Revised ITR Timeline Card */}
      <section className="step6-card step6-timeline-card">
        <div className="step6-timeline-header">
          <h3 className="step6-card-heading">Revised ITR Timeline</h3>
          <span className="step6-stage-badge">Stage 3 of 6</span>
        </div>

        {/* Horizontal Timeline Stages */}
        <div className="step6-stepper-scroll">
          <div className="step6-stepper-row">
            {stages.map((stage, index) => {
              const isLast = index === stages.length - 1
              return (
                <div key={stage.id} className="step6-stepper-item-wrap">
                  <div className={`step6-stepper-node status-${stage.status}`}>
                    <div className="step6-node-icon-circle">
                      {stage.icon}
                    </div>
                    <span className="step6-node-title">{stage.title}</span>
                  </div>

                  {!isLast && (
                    <div
                      className={`step6-stepper-connector connector-${
                        stage.status === 'completed'
                          ? stages[index + 1].status === 'completed' || stages[index + 1].status === 'active'
                            ? 'completed'
                            : 'active-transition'
                          : 'upcoming'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Inset Callout Note */}
        <div className="step6-current-stage-callout">
          <div className="step6-callout-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <div className="step6-callout-text">
            <h4 className="step6-callout-title">Current Stage 3: CA Verification</h4>
            <p className="step6-callout-desc">
              Certified CA verifying original filing and revised declaration.
            </p>
          </div>
        </div>
      </section>

      {/* 2-Column Desktop Grid for Summary & Information */}
      <div className="step6-details-grid">
        {/* Left Column: What We Have */}
        <section className="step6-card step6-what-we-have-card">
          <div className="step6-card-title-row">
            <div className="step6-title-icon-wrap icon-orange">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h3 className="step6-card-heading">What we have</h3>
          </div>

          <div className="step6-key-val-list">
            <div className="step6-key-val-row">
              <span className="step6-key-label">Assessment Year</span>
              <span className="step6-val-text">{displayAy}</span>
            </div>
            <div className="step6-key-val-row">
              <span className="step6-key-label">Return Form</span>
              <span className="step6-val-text">Revised ITR</span>
            </div>
            <div className="step6-key-val-row">
              <span className="step6-key-label">Income Sources</span>
              <span className="step6-val-text">Revised Return Filing</span>
            </div>
            <div className="step6-key-val-row">
              <span className="step6-key-label">Tax Regime</span>
              <span className="step6-val-text">New Tax Regime</span>
            </div>
            <div className="step6-key-val-row">
              <span className="step6-key-label">Documents</span>
              <span className="step6-val-text">{docCount} of 6 received</span>
            </div>
            <div className="step6-key-val-row">
              <span className="step6-key-label">Refund Bank</span>
              <span className="step6-val-text">HDFC Bank ···· 1234</span>
            </div>
          </div>
        </section>

        {/* Right Column: What Happens Next + Assigned CA */}
        <div className="step6-right-col-stack">
          {/* What happens next */}
          <section className="step6-card step6-what-happens-next-card">
            <div className="step6-card-title-row">
              <div className="step6-title-icon-wrap icon-blue">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <h3 className="step6-card-heading">What happens next</h3>
            </div>
            <p className="step6-next-text">
              A Tax Executive will verify your documents, prepare the return and send you the computation to review and approve. You will get a notification at each stage.
            </p>
          </section>

          {/* Dedicated CA Assurance Card */}
          <section className="step6-card step6-ca-assigned-card">
            <div className="step6-ca-header">
              <div className="step6-ca-avatar">CA</div>
              <div className="step6-ca-meta">
                <div className="step6-ca-name">Senior CA Meera Iyer</div>
                <div className="step6-ca-subtitle">Direct Tax Specialist · 12+ Yrs Exp</div>
              </div>
            </div>
            <div className="step6-ca-badges">
              <span className="step6-ca-badge">⚡ 4-Hour Review SLA</span>
              <span className="step6-ca-badge">🛡️ Notice Protection</span>
            </div>
          </section>
        </div>
      </div>

      {/* Full-Width Action Buttons */}
      <div className="step6-actions-wrap">
        <button
          type="button"
          className="step6-btn-primary"
          onClick={handleViewStatus}
        >
          View Application Status &nbsp;→
        </button>

        <button
          type="button"
          className="step6-btn-secondary"
          onClick={onDownloadReceipt}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download TaxEdge Application Receipt
        </button>
      </div>
    </div>
  )
}
