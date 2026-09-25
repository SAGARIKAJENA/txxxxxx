import React from 'react'
import { DocumentCard } from '@shared/components'
import type { LoanDocumentDefinition, UploadedLoanDocument } from '../../documents/loanDocument.types'
import './LoanDocumentSection.css'

export interface LoanDocumentSectionProps {
  title: string
  badgeLabel?: string
  isRequiredBadge?: boolean
  documents: LoanDocumentDefinition[]
  uploadedDocs: Record<string, UploadedLoanDocument>
  onUpload: (id: string, file: File) => void
  onRemove: (id: string) => void
  className?: string
}

export const LoanDocumentSection: React.FC<LoanDocumentSectionProps> = ({
  title,
  badgeLabel,
  isRequiredBadge = false,
  documents,
  uploadedDocs,
  onUpload,
  onRemove,
  className = '',
}) => {
  return (
    <div className={`loan-doc-section ${className}`.trim()}>
      <div className="loan-doc-section__header">
        <h3 className="loan-doc-section__title">{title}</h3>
        {badgeLabel && (
          <span
            className={`loan-doc-section__badge ${
              isRequiredBadge ? 'loan-doc-section__badge--required' : ''
            }`}
          >
            {badgeLabel}
          </span>
        )}
      </div>

      <div className="loan-doc-section__list">
        {documents.map((doc) => {
          const uploaded = uploadedDocs[doc.id]
          return (
            <DocumentCard
              key={doc.id}
              id={doc.id}
              title={doc.title}
              subtitle={doc.subtitle}
              isRequired={doc.isRequired}
              isUploaded={Boolean(uploaded)}
              fileName={uploaded?.name}
              fileSize={uploaded?.size}
              onUpload={onUpload}
              onRemove={onRemove}
            />
          )
        })}
      </div>
    </div>
  )
}

export default LoanDocumentSection
