import React from 'react'
import './DocumentTracker.css'

export interface DocumentTrackerProps {
  uploadedCount: number
  totalCount: number
  label?: string
  className?: string
}

export const DocumentTracker: React.FC<DocumentTrackerProps> = ({
  uploadedCount,
  totalCount,
  label,
  className = '',
}) => {
  const progressPercent = totalCount > 0 ? Math.round((uploadedCount / totalCount) * 100) : 0

  return (
    <div className={`supporting-docs-tracker ${className}`}>
      <div className="supporting-docs-tracker__header">
        <span>{label || `${uploadedCount} of ${totalCount} documents uploaded`}</span>
        <span className="supporting-docs-tracker__count">{progressPercent}%</span>
      </div>
      <div className="supporting-docs-tracker__bar-track">
        <div
          className="supporting-docs-tracker__bar-fill"
          style={{ width: `${Math.max(uploadedCount > 0 ? 5 : 0, progressPercent)}%` }}
        />
      </div>
    </div>
  )
}

export default DocumentTracker
