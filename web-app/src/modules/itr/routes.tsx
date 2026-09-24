import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { routePaths } from "@core/config";

const Itr = lazy(() => import("./pages/Itr/Itr"));
const FileItr = lazy(() => import("./pages/FileItr/FileItr.tsx"));
const ItrFiling = lazy(() => import("./pages/ItrFiling/ItrFiling"));
const TdsRefund = lazy(() => import("./pages/TdsRefund/TdsRefund"));
const PreviousYearItr = lazy(
  () => import("./pages/PreviousYearItr/PreviousYearItr.tsx"),
);
const RevisedItr = lazy(() => import("./pages/RevisedItr/RevisedItr"));
const TaxNoticeAssistance = lazy(
  () => import("./pages/TaxNoticeAssistance/TaxNoticeAssistance"),
);
const TdsRefundEstimator = lazy(
  () => import("./pages/TdsRefundEstimator/TdsRefundEstimator.tsx"),
);
const TaxComputation = lazy(
  () => import("./pages/TaxComputation/TaxComputation.tsx"),
);

export const itrRoutes: RouteObject[] = [
  { path: routePaths.itr.root, element: <Itr /> },
  { path: routePaths.itr.fileItr, element: <FileItr /> },
  { path: routePaths.itr.itrFiling, element: <ItrFiling /> },
  { path: routePaths.itr.tdsRefund, element: <TdsRefund /> },
  { path: routePaths.itr.previousYearItr, element: <PreviousYearItr /> },
  { path: routePaths.itr.revisedItr, element: <RevisedItr /> },
  {
    path: routePaths.itr.taxNoticeAssistance,
    element: <TaxNoticeAssistance />,
  },
  { path: routePaths.itr.tdsRefundEstimator, element: <TdsRefundEstimator /> },
  { path: routePaths.itr.taxComputation, element: <TaxComputation /> },
];
