import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { routePaths } from '@core/config'
import { DocumentCard } from '@shared/components'
import './DocumentsKyc.css'

interface KycDocumentItem {
  id: string
  title: string
  subtitle: string
  isRequired: boolean
  isUploaded: boolean
  fileName?: string
}

export const DocumentsKyc: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const companyType = location.state?.companyType || 'pvt_ltd'
  const isOpc = companyType === 'opc'
  const [error, setError] = useState<string>('')

  const [promoterDocs, setPromoterDocs] = useState<KycDocumentItem[]>([
    {
      id: 'pan-card',
      title: 'PAN Card',
      subtitle: 'Promoter KYC',
      isRequired: true,
      isUploaded: false,
    },
    {
      id: 'identity-address',
      title: 'Identity / Address Proof',
      subtitle: 'Aadhaar / Passport / other applicable proof',
      isRequired: true,
      isUploaded: false,
    },
    {
      id: 'passport-photo',
      title: 'Passport Photo',
      subtitle: 'Required if applicable',
      isRequired: false,
      isUploaded: false,
    },
  ])

  const [officeDocs, setOfficeDocs] = useState<KycDocumentItem[]>([
    {
      id: 'office-address',
      title: 'Office Address Proof',
      subtitle: 'Lease / Rent Agreement / Ownership Proof',
      isRequired: true,
      isUploaded: false,
    },
    {
      id: 'office-utility',
      title: 'Office Utility Bill',
      subtitle: 'Electricity / Water / applicable utility bill',
      isRequired: true,
      isUploaded: false,
    },
    {
      id: 'owner-noc',
      title: 'Owner NOC',
      subtitle: 'Required only if applicable',
      isRequired: false,
      isUploaded: false,
    },
  ])

  const [statutoryDocs, setStatutoryDocs] = useState<KycDocumentItem[]>([
    {
      id: 'statutory-moa',
      title: 'MOA / e-MOA',
      subtitle: 'Handled/generated as applicable',
      isRequired: false,
      isUploaded: false,
    },
    {
      id: 'statutory-aoa',
      title: 'AOA / e-AOA',
      subtitle: 'Handled/generated as applicable',
      isRequired: false,
      isUploaded: false,
    },
  ])

  const handleUpload = (
    section: 'promoter' | 'office' | 'statutory',
    id: string,
    file: File
  ) => {
    setError('')
    const updateFn = (prev: KycDocumentItem[]) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, isUploaded: true, fileName: file.name } : doc
      )

    if (section === 'promoter') setPromoterDocs(updateFn)
    if (section === 'office') setOfficeDocs(updateFn)
    if (section === 'statutory') setStatutoryDocs(updateFn)
  }

  const handleRemove = (
    section: 'promoter' | 'office' | 'statutory',
    id: string
  ) => {
    setError('')
    const updateFn = (prev: KycDocumentItem[]) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, isUploaded: false, fileName: undefined } : doc
      )

    if (section === 'promoter') setPromoterDocs(updateFn)
    if (section === 'office') setOfficeDocs(updateFn)
    if (section === 'statutory') setStatutoryDocs(updateFn)
  }

  const handleContinue = () => {
    const missingPromoter = promoterDocs.filter((d) => d.isRequired && !d.isUploaded).map((d) => d.title)
    const missingOffice = officeDocs.filter((d) => d.isRequired && !d.isUploaded).map((d) => d.title)
    const missingStatutory = statutoryDocs.filter((d) => d.isRequired && !d.isUploaded).map((d) => d.title)
    const missing = [...missingPromoter, ...missingOffice, ...missingStatutory]

    if (missing.length > 0) {
      setError(`Please upload all mandatory documents before proceeding: ${missing.join(', ')}.`)
      return
    }

    setError('')
    const sanitizedDocuments = {
      promoterDocs: promoterDocs.map((d) => ({ id: d.id, title: d.title, isUploaded: d.isUploaded, fileName: d.fileName })),
      officeDocs: officeDocs.map((d) => ({ id: d.id, title: d.title, isUploaded: d.isUploaded, fileName: d.fileName })),
      statutoryDocs: statutoryDocs.map((d) => ({ id: d.id, title: d.title, isUploaded: d.isUploaded, fileName: d.fileName })),
    }

    navigate(routePaths.incorporation.linkedRegistrations, {
      state: {
        ...location.state,
        companyType,
        documents: sanitizedDocuments,
      },
    })
  }

  const renderDocSection = (
    title: string,
    section: 'promoter' | 'office' | 'statutory',
    docs: KycDocumentItem[]
  ) => (
    <section className="docs-kyc-section">
      <h2 className="docs-kyc-section__title">{title}</h2>
      <div className="docs-kyc-section__list">
        {docs.map((doc) => (
          <DocumentCard
            key={doc.id}
            id={doc.id}
            title={doc.title}
            subtitle={doc.subtitle}
            isRequired={doc.isRequired}
            isUploaded={doc.isUploaded}
            fileName={doc.fileName}
            onUpload={(_, file) => handleUpload(section, doc.id, file)}
            onRemove={() => handleRemove(section, doc.id)}
          />
        ))}
      </div>
    </section>
  )

  return (
    <div className="docs-kyc-page">
      {/* Progress Header */}
      <div className="docs-kyc-stepbar">
        <span className="docs-kyc-stepbar__badge">Step 6 of 11</span>
        <span className="docs-kyc-stepbar__text">Documents & KYC Checklist</span>
        <div className="docs-kyc-stepbar__line">
          <div className="docs-kyc-stepbar__line-fill" />
        </div>
      </div>

      <div className="docs-kyc-header">
        <h1 className="docs-kyc-header__title">Documents & KYC Checklist</h1>
        <p className="docs-kyc-header__subtitle">
          Upload digital copies of promoter identity, office proofs, and statutory e-MoA/e-AoA drafts.
        </p>
      </div>

      {renderDocSection('PROMOTER / DIRECTOR KYC', 'promoter', promoterDocs)}
      {renderDocSection('REGISTERED OFFICE', 'office', officeDocs)}
      {renderDocSection('STATUTORY DOCUMENTS', 'statutory', statutoryDocs)}

      {/* Error Alert */}
      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #f87171',
          color: '#991b1b',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          margin: '1rem 0',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Footer Navigation */}
      <footer className="docs-kyc-footer">
        <button
          type="button"
          className="docs-kyc-btn-back"
          onClick={() => navigate(routePaths.incorporation.capitalDetails, { state: location.state })}
        >
          &larr; Back
        </button>
        <button
          type="button"
          className="docs-kyc-btn-continue"
          onClick={handleContinue}
        >
          Continue &rarr;
        </button>
      </footer>
    </div>
  )
}

export default DocumentsKyc
