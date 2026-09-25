import React from 'react'
import { Link } from 'react-router-dom'
import './LoanBreadcrumbs.css'

export interface BreadcrumbItem {
  label: string
  to?: string
}

export interface LoanBreadcrumbsProps {
  items: BreadcrumbItem[]
}

export const LoanBreadcrumbs: React.FC<LoanBreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="loan-breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <React.Fragment key={item.label}>
            {item.to && !isLast ? (
              <Link to={item.to} className="loan-breadcrumbs__link">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'loan-breadcrumbs__current' : 'loan-breadcrumbs__link'}>
                {item.label}
              </span>
            )}
            {!isLast && <span className="loan-breadcrumbs__separator">›</span>}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

export default LoanBreadcrumbs
