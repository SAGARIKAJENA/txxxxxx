import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { routePaths } from '@core/config'

const LoanMarketplace = lazy(() => import('./pages/LoanMarketplace/LoanMarketplace'))
const Loans = lazy(() => import('./pages/Loans/Loans'))
const HomeLoan = lazy(() => import('./pages/HomeLoan/HomeLoan'))
const PersonalLoan = lazy(() => import('./pages/PersonalLoan/PersonalLoan'))
const BusinessLoan = lazy(() => import('./pages/BusinessLoan/BusinessLoan'))
const PropertyLoan = lazy(() => import('./pages/PropertyLoan/PropertyLoan'))
const VehicleLoan = lazy(() => import('./pages/VehicleLoan/VehicleLoan'))
const WorkingCapitalLoan = lazy(() => import('./pages/WorkingCapitalLoan/WorkingCapitalLoan'))
const MachineryLoan = lazy(() => import('./pages/MachineryLoan/MachineryLoan'))
const ProjectFinance = lazy(() => import('./pages/ProjectFinance/ProjectFinance'))
const MSMELoan = lazy(() => import('./pages/MSMELoan/MSMELoan'))
const LoanApplicationStatus = lazy(() => import('./pages/LoanApplicationStatus/LoanApplicationStatus'))

export const loansRoutes: RouteObject[] = [
  { path: routePaths.loans, element: <LoanMarketplace /> },
  { path: '/loans/all', element: <Loans /> },
  { path: routePaths.loansHomeLoan, element: <HomeLoan /> },
  { path: routePaths.loansPersonalLoan, element: <PersonalLoan /> },
  { path: routePaths.loansBusinessLoan, element: <BusinessLoan /> },
  { path: routePaths.loansPropertyLoan, element: <PropertyLoan /> },
  { path: routePaths.loansVehicleLoan, element: <VehicleLoan /> },
  { path: routePaths.loansWorkingCapitalLoan, element: <WorkingCapitalLoan /> },
  { path: routePaths.loansMachineryLoan, element: <MachineryLoan /> },
  { path: routePaths.loansProjectFinance, element: <ProjectFinance /> },
  { path: routePaths.loansMsmeLoan, element: <MSMELoan /> },
  { path: '/loans/status/:id', element: <LoanApplicationStatus /> },
  { path: '/loans/status', element: <LoanApplicationStatus /> },
]

export default loansRoutes
