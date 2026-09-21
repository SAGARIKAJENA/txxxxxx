import React, { useRef } from 'react'
import './DocumentCard.css'

export interface DocumentCardProps {
  id: string
  title: string
  subtitle?: string
  isRequired?: boolean
  iconBg?: string
  iconColor?: string
  isUploaded?: boolean
  fileName?: string
  file?: File
  icon?: React.ReactNode
  accept?: string
  onUpload?: (id: string, file: File) => void
  onRemove?: (id: string) => void
  onView?: (doc: { id: string; title: string; fileName?: string; file?: File }) => void
  children?: React.ReactNode
  className?: string
}

/* Common Document Action Icons */
const CloudUploadIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="17"
    height="17"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const ViewEyeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const ReplaceRotateIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
)

const DeleteTrashIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
)

/**
 * Shared, reusable DocumentCard component
 * Standardized across GST, ITR, TDS and other TaxEdge modules
 */
export const DocumentCard: React.FC<DocumentCardProps> = ({
  id,
  title,
  subtitle,
  isRequired = false,
  iconBg = '#e0f2fe',
  iconColor = '#0284c7',
  isUploaded = false,
  fileName,
  file,
  icon,
  accept = '.pdf,.png,.jpg,.jpeg,.doc,.docx',
  onUpload,
  onRemove,
  onView,
  children,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload?.(id, e.target.files[0])
    }
  }

  const handleView = () => {
    if (onView) {
      onView({ id, title, fileName, file })
    } else if (file) {
      const url = URL.createObjectURL(file)
      window.open(url, '_blank')
    } else {
      alert(`Viewing ${fileName || title}`)
    }
  }

  return (
    <article className={`taxedge-doc-card ${className}`} data-testid={`doc-card-${id}`}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept={accept}
        onChange={handleFileChange}
      />

      <div className="taxedge-doc-card__body">
        {/* Left icon and details */}
        <div className="taxedge-doc-card__left">
          <div
            className="taxedge-doc-card__icon"
            style={{ backgroundColor: iconBg, color: iconColor }}
            aria-hidden="true"
          >
            {icon || (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <circle cx="8.5" cy="10" r="2.5" />
                <line x1="14" y1="9" x2="18" y2="9" />
                <line x1="14" y1="13" x2="17" y2="13" />
                <line x1="6" y1="16" x2="18" y2="16" />
              </svg>
            )}
          </div>

          <div className="taxedge-doc-card__details">
            <h4 className="taxedge-doc-card__title">
              {title} {isRequired && <span className="taxedge-doc-card__asterisk">*</span>}
            </h4>

            {children ? (
              children
            ) : !isUploaded ? (
              <p className="taxedge-doc-card__desc">
                {subtitle || (isRequired ? 'Required document' : 'Optional document')}
              </p>
            ) : (
              <p className="taxedge-doc-card__filename">{fileName}</p>
            )}
          </div>
        </div>

        {/* Right action / status */}
        <div className="taxedge-doc-card__right">
          {!isUploaded ? (
            <div className="taxedge-doc-upload-btn-group">
              <button
                type="button"
                className="taxedge-doc-btn-upload-file"
                onClick={() => fileInputRef.current?.click()}
                data-testid={`upload-btn-${id}`}
              >
                <CloudUploadIcon />
                Upload File
              </button>
            </div>
          ) : (
            <span className="taxedge-doc-status-badge taxedge-doc-status-badge--uploaded">
              <CheckCircleIcon />
              Uploaded
            </span>
          )}
        </div>
      </div>

      {/* Footer action bar: shown when document is uploaded */}
      {isUploaded && (
        <footer className="taxedge-doc-card__footer">
          <button
            type="button"
            className="taxedge-doc-card__action-btn taxedge-doc-card__action-btn--view"
            onClick={handleView}
            data-testid={`view-doc-${id}`}
          >
            <ViewEyeIcon />
            View Document
          </button>

          <span className="taxedge-doc-card__divider" aria-hidden="true" />

          <button
            type="button"
            className="taxedge-doc-card__action-btn"
            onClick={() => fileInputRef.current?.click()}
            data-testid={`replace-doc-${id}`}
          >
            <ReplaceRotateIcon />
            Replace
          </button>

          <span className="taxedge-doc-card__divider" aria-hidden="true" />

          <button
            type="button"
            className="taxedge-doc-card__action-btn taxedge-doc-card__action-btn--delete"
            onClick={() => onRemove?.(id)}
            title={`Delete ${title}`}
            aria-label={`Delete ${title}`}
            data-testid={`delete-doc-${id}`}
          >
            <DeleteTrashIcon />
          </button>
        </footer>
      )}
    </article>
  )
}
