import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { routePaths } from '@core/config'

const CompanyRegistration = lazy(() => import('./pages/CompanyRegistration/CompanyRegistration'))
const SelectCompanyType = lazy(() => import('./pages/SelectCompanyType/SelectCompanyType'))
const CompanyDetails = lazy(() => import('./pages/CompanyDetails/CompanyDetails'))
const RegisteredOffice = lazy(() => import('./pages/RegisteredOffice/RegisteredOffice'))
const PromoterDetails = lazy(() => import('./pages/PromoterDetails/PromoterDetails'))
const CapitalDetails = lazy(() => import('./pages/CapitalDetails/CapitalDetails'))
const DocumentsKyc = lazy(() => import('./pages/DocumentsKyc/DocumentsKyc'))
const LinkedRegistrations = lazy(() => import('./pages/LinkedRegistrations/LinkedRegistrations'))
const ReviewApplication = lazy(() => import('./pages/ReviewApplication/ReviewApplication'))
const FeesPayment = lazy(() => import('./pages/FeesPayment/FeesPayment'))
const SubmissionSuccess = lazy(() => import('./pages/SubmissionSuccess/SubmissionSuccess'))
const ApplicationTracking = lazy(() => import('./pages/ApplicationTracking/ApplicationTracking'))
const ApplicationReceipt = lazy(() => import('./pages/ApplicationReceipt/ApplicationReceipt'))

import { IncorporationWizardLayout } from './components'

export const incorporationRoutes: RouteObject[] = [
  {
    path: routePaths.incorporation.root,
    element: <CompanyRegistration />,
  },
  {
    element: <IncorporationWizardLayout />,
    children: [
      {
        path: routePaths.incorporation.selectType,
        element: <SelectCompanyType />,
      },
      {
        path: routePaths.incorporation.companyDetails,
        element: <CompanyDetails />,
      },
      {
        path: routePaths.incorporation.registeredOffice,
        element: <RegisteredOffice />,
      },
      {
        path: routePaths.incorporation.promoterDetails,
        element: <PromoterDetails />,
      },
      {
        path: routePaths.incorporation.capitalDetails,
        element: <CapitalDetails />,
      },
      {
        path: routePaths.incorporation.documentsKyc,
        element: <DocumentsKyc />,
      },
      {
        path: routePaths.incorporation.linkedRegistrations,
        element: <LinkedRegistrations />,
      },
      {
        path: routePaths.incorporation.reviewApplication,
        element: <ReviewApplication />,
      },
      {
        path: routePaths.incorporation.feesPayment,
        element: <FeesPayment />,
      },
    ],
  },
  {
    path: routePaths.incorporation.submissionSuccess,
    element: <SubmissionSuccess />,
  },
  {
    path: routePaths.incorporation.applicationTracking,
    element: <ApplicationTracking />,
  },
  {
    path: routePaths.incorporation.receipt,
    element: <ApplicationReceipt />,
  },
]
