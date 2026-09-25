import React from 'react'
import { LoanReviewSection } from '../../../../components/LoanReviewSection/LoanReviewSection'
import type { ProjectFinanceData } from '../../types/projectFinance.types'
import './ReviewAndSubmit.css'

export interface ReviewAndSubmitProps {
  formData: ProjectFinanceData
  updateFormData: (fields: Partial<ProjectFinanceData>) => void
  onNavigateToStep: (stepNumber: number) => void
}

export const ReviewAndSubmit: React.FC<ReviewAndSubmitProps> = ({
  formData,
  updateFormData,
  onNavigateToStep,
}) => {
  const docCount = Object.keys(formData.uploadedDocs || {}).length

  return (
    <div className="project-finance-review">
      {/* 1. Requirements */}
      <LoanReviewSection
        title="Project & Capital Outlay Details"
        onEdit={() => onNavigateToStep(1)}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        }
        items={[
          {
            label: 'Project Title',
            value: formData.projectName || '—',
          },
          {
            label: 'Sector',
            value: formData.projectSector || '—',
          },
          {
            label: 'Total Project Cost (CAPEX)',
            value: formData.totalProjectCost ? `₹${formData.totalProjectCost}` : '—',
          },
          {
            label: 'Promoter Equity (%)',
            value: formData.promoterEquityContribution || '—',
          },
          {
            label: 'Debt Sought',
            value: `₹${(formData.debtSoughtAmount / 10000000).toFixed(1)} Crores`,
          },
          {
            label: 'Tenure',
            value: `${formData.repaymentTenureYears} Years (${formData.repaymentTenureYears * 12} Months)`,
          },
        ]}
      />

      {/* 2. Sponsor Profile */}
      <LoanReviewSection
        title="Sponsor & Promoter Credentials"
        onEdit={() => onNavigateToStep(2)}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="7" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        }
        items={[
          {
            label: 'Sponsor Parent Company',
            value: formData.sponsorEntityName || '—',
          },
          {
            label: 'CIN / Registration',
            value: formData.cinOrLlpNumber || '—',
          },
          {
            label: 'Promoter Group Net Worth',
            value: formData.promoterGroupNetWorth || '—',
          },
          {
            label: 'Track Record Experience',
            value: formData.priorCompletedProjects || '—',
          },
        ]}
      />

      {/* 3. Banking & Tax Compliance */}
      <LoanReviewSection
        title="Lead Syndication & Escrow"
        onEdit={() => onNavigateToStep(3)}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        }
        items={[
          {
            label: 'Preferred Lead Institution',
            value: formData.leadBankName || '—',
          },
          {
            label: 'Account Number',
            value: formData.currentAccountNumber ? `••••${formData.currentAccountNumber.slice(-4)}` : '—',
          },
          {
            label: 'IFSC Code',
            value: formData.ifscCode || '—',
          },
          {
            label: 'SPV PAN',
            value: formData.panNumber || '—',
          },
        ]}
      />

      {/* 4. Uploaded Documents */}
      <LoanReviewSection
        title={`Uploaded Documents (${docCount})`}
        onEdit={() => onNavigateToStep(4)}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        }
        items={[
          {
            label: 'Documents Attached',
            value: docCount > 0 ? `${docCount} documents attached` : 'No documents uploaded',
          },
        ]}
      />

      {/* Declaration */}
      <div className="project-finance-review__declaration">
        <input
          id="project-finance-terms-checkbox"
          type="checkbox"
          className="project-finance-review__checkbox"
          checked={formData.termsAccepted}
          onChange={(e) => updateFormData({ termsAccepted: e.target.checked })}
        />
        <label htmlFor="project-finance-terms-checkbox" className="project-finance-review__label">
          I declare that the DPR, financial model projections, and regulatory permissions submitted are genuine, and I agree to the{' '}
          <span className="project-finance-review__terms-link">Terms &amp; Conditions</span> for Project Debt Syndication.
        </label>
      </div>
    </div>
  )
}

export default ReviewAndSubmit
