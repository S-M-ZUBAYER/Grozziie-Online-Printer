import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import ErrorPage from "../Share/Error Page/ErrorPage";
import Home from "../components/Home/Home";
import BatchPrint from "../components/BatchPrint/BatchPrint";
import SinglePrint from "../components/SinglePrint/SinglePrint";
import Contact from "../components/Contact/Contact";
import BatchPrintExpressDelivery from "../components/BatchPrintExpressDelivery/BatchPrintExpressDelivery";
import SettingLayout from "../components/Settings/SettingLayout/SettingLayout";
import ExpressUnreachableArea from "../components/Settings/ExpressUnreachablAreaPage/ExpressUnreachableArea";
import LogisticMachineSettings from "../components/Settings/LogisticMachinePage/LogisticMachineSettings";
import AutomaticShippingSettings from "../components/Settings/AutomaticShippingPage/AutomaticShippingSettings";
import OrderPrintFilter from "../components/Settings/OrderPrintPage/OrderPrintFilter";
import Settings from "../components/Settings/SettingsPage/Settings";
import DisplayOrder from "../components/Settings/DisplayOrderPage/DisplayOrder";
import SenderInfo from "../components/Settings/SenderInfoPage/SenderInfo";
import ManualOrder from "../components/ManualOrder/ManualOrder";
import UtilityLayout from "../components/Utility/UtilityLayout/UtilityLayout";
import Utility from "../components/Utility/UtilityPage/Utility";
import RelatedStores from "../components/Utility/RelatedStores/RelatedStores";
import OrderInquiry from "../components/Utility/OrderInquiry/OrderInquiry";
import PrintRecord from "../components/Utility/PrintRecord/PrintRecord";
import DeliveryRecord from "../components/Utility/DeliveryRecord/DeliveryRecord";
import ScanAndShip from "../components/Utility/ScanAndShip/ScanAndShip";
import AutomaticPrinting from "../components/Utility/AutomaticPrinting/AutomaticPrinting";
import UnusualOrder from "../components/Utility/UnusualOrder/UnusualOrder";
import ImportOrderAndShip from "../components/Utility/ImportOrderAndShip/ImportOrderAndShip";
import ExpressReconciliation from "../components/Utility/ExpressReconciliation/ExpressReconciliation";
import SingleNumberSharing from "../components/Utility/SingleNumberSharing/SingleNumberSharing";
import MissionCenter from "../components/Utility/MissionCenter/MissionCenter";
import ProductReportSummary from "../components/Utility/ProductReportSummary/ProductReportSummary";
import RookiePrivacyForm from "../components/Utility/RookiePrivacyForm/RookiePrivacyForm";
import LogisticManager from "../components/Utility/LogisticManager/LogisticManager";
import OrderOperationLog from "../components/Utility/OrderOperationLog/OrderOperationLog";
import LoginLog from "../components/Utility/LoginLog/LoginLog";
import MarketingLayout from "../components/Marketing/MarketingLayout/MarketingLayout";
import MarketingPage from "../components/Marketing/MarketingPage/MarketingPage";
import Transactions from "../components/Marketing/Transactions/Transactions";
import PrivateDomain from "../components/Marketing/PrivateDomain/PrivateDomain";
import Merchandise from "../components/Marketing/Merchandise/Merchandise";
import Shop from "../components/Marketing/Shop/Shop";
import Promotion from "../components/Marketing/Promotion/Promotion";
import DeliveryCompany from "../components/Marketing/DeliveryCompany/DeliveryCompany";
import CustomerService from "../components/Marketing/CustomerService/CustomerService";
import Content from "../components/Marketing/Content/Content";
import Finance from "../components/Marketing/Finance/Finance";
import MarketingData from "../components/Marketing/MarketingData/MarketingData";
import MarketingService from "../components/Marketing/MarketingService/MarketingService";
import ProductApplication from "../components/Marketing/ProductApplication/ProductApplication";
import Registration from "../components/Auth/Registration";
import Login from "../components/Auth/Login";
import Pricing from "../components/Pricing/Pricing";
import PaymentSystem from "../components/Pricing/PaymentSystem";
import ForgotPassword from "../components/Auth/ForgotPassword";
import ResetPassword from "../components/Auth/ResetPassword";
import PrivateRoute from "../components/Private/PrivateRoute";
import PaymentPrivateRoute from "../components/Private/PaymentPrivateRoute";
import PaymentAlipay from "../components/Pricing/PaymentAlipay";
import VerifyEmailPage from "../components/Auth/VerifyEmailPage";
import Package from "../components/Packages/Package";
import BatchPrintPrinting from "../components/BatchPrintExpressDelivery/BatchPrintPrinting";
import WrappedPaymentPage from "../components/Pricing/PaymentPage";
import SuccessPage from "../components/Pricing/SuccessPage";
import LazadaBatchPrint from "../components/LazadaShop/LazadaBatchPrint";

export const routes = createBrowserRouter([
  {
    path: "/error",
    element: <ErrorPage />,
  },
  {
    path: "/register",
    element: <Registration />,
  },
  // {
  //   path: "/payment",
  //   element: <WrappedPaymentPage />,
  // },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgotpassword",
    element: <ForgotPassword />,
  },
  {
    path: "/resetpassword",
    element: <ResetPassword />,
  },
  {
    path: "/verifyemail",
    element: <VerifyEmailPage />,
  },
  {
    path: "/",
    element: <Main />,
    // element: <PrivateRoute isAuth={true} element={<Main />} />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: (
          // <PrivateRoute>
          // <PaymentPrivateRoute>
          <Home />
          // </PaymentPrivateRoute>
          // </PrivateRoute>
        ),
      },
      {
        path: "/home",
        element: (
          // <PrivateRoute>
          // <PaymentPrivateRoute>
          <Home />
          // </PaymentPrivateRoute>
          // </PrivateRoute>
        ),
      },
      {
        path: "/首页",
        element: (
          // <PrivateRoute>
          // <PaymentPrivateRoute>
          <Home />
          // </PaymentPrivateRoute>
          // </PrivateRoute>
        ),
      },
      {
        path: "/batchPrint",
        element: (
          <PrivateRoute>
            <PaymentPrivateRoute>
              <BatchPrint />
            </PaymentPrivateRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "/批量打印",
        element: (
          <PrivateRoute>
            <PaymentPrivateRoute>
              <BatchPrint />
            </PaymentPrivateRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "/packages",
        element: (
          <PrivateRoute>
            <PaymentPrivateRoute>
              <Package />
            </PaymentPrivateRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "/LazadaOrderManagement",
        element: (
          // <PrivateRoute>
          <PaymentPrivateRoute>
            <LazadaBatchPrint />
          </PaymentPrivateRoute>
          // </PrivateRoute>
        ),
      },
      {
        path: "/singlePrint",
        element: (
          <PrivateRoute>
            <PaymentPrivateRoute>
              <SinglePrint />
            </PaymentPrivateRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "/单个打印",
        element: (
          // <PrivateRoute>
          // <PaymentPrivateRoute>
          <SinglePrint />
          // </PaymentPrivateRoute>
          // </PrivateRoute>
        ),
      },
      {
        path: "/manualOrder",
        element: (
          <PrivateRoute>
            <PaymentPrivateRoute>
              <ManualOrder />
            </PaymentPrivateRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "/手动订单",
        element: (
          // <PrivateRoute>
          // <PaymentPrivateRoute>
          <ManualOrder />
          // </PaymentPrivateRoute>
          // </PrivateRoute>
        ),
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/联系我们",
        element: <Contact />,
      },
      {
        path: "/displayorder",
        element: <DisplayOrder />,
      },
      {
        path: "/batchprintexpressdelivery",
        element: (
          // <PrivateRoute>
          // <PaymentPrivateRoute>
          <BatchPrintExpressDelivery />
          // </PaymentPrivateRoute>
          // </PrivateRoute>
        ),
      },
      {
        path: "/batchPrintPrinting",
        element: (
          // <PrivateRoute>
          // <PaymentPrivateRoute>
          <BatchPrintPrinting />
          // </PaymentPrivateRoute>
          // </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/settings",
    element: <SettingLayout />,
    children: [
      {
        path: "/settings/recipient information",
        element: <Settings />,
      },
      {
        path: "/settings/sender information",
        element: <SenderInfo />,
      },
      {
        path: "/settings/display order",
        element: <DisplayOrder />,
      },
      {
        path: "/settings/Order Print Filter",
        element: <OrderPrintFilter />,
      },
      {
        path: "/settings/Automatic Shipping Settings",
        element: <AutomaticShippingSettings />,
      },
      {
        path: "/settings/Logistic Machine Settings",
        element: <LogisticMachineSettings />,
      },
      {
        path: "/settings/Express Unreachable Area",
        element: <ExpressUnreachableArea />,
      },
    ],
  },
  // {
  //   path: "/设置",
  //   element: <SettingLayout />,
  //   children: [
  //     {
  //       path: "/settings/recipient information",
  //       element: <Settings />,
  //     },
  //     {
  //       path: "/settings/sender information",
  //       element: <SenderInfo />,
  //     },
  //     {
  //       path: "/settings/display order",
  //       element: <DisplayOrder />,
  //     },
  //     {
  //       path: "/settings/Order Print Filter",
  //       element: <OrderPrintFilter />,
  //     },
  //     {
  //       path: "/settings/Automatic Shipping Settings",
  //       element: <AutomaticShippingSettings />,
  //     },
  //     {
  //       path: "/settings/Logistic Machine Settings",
  //       element: <LogisticMachineSettings />,
  //     },
  //     {
  //       path: "/settings/Express Unreachable Area",
  //       element: <ExpressUnreachableArea />,
  //     },
  //   ],
  // },
  {
    path: "/utility",
    element: <UtilityLayout />,
    children: [
      {
        path: "/utility/related stores",
        element: <RelatedStores />,
      },
      {
        path: "/utility/order inquiry",
        element: <OrderInquiry />,
      },
      {
        path: "/utility/print record",
        element: <PrintRecord />,
      },
      {
        path: "/utility/delivery record",
        element: <DeliveryRecord />,
      },
      {
        path: "/utility/scan and ship",
        element: <ScanAndShip />,
      },
      {
        path: "/utility/automatic printing",
        element: <AutomaticPrinting />,
      },
      {
        path: "/utility/unusual order",
        element: <UnusualOrder />,
      },
      {
        path: "/utility/import order and ship",
        element: <ImportOrderAndShip />,
      },
      {
        path: "/utility/express reconciliation",
        element: <ExpressReconciliation />,
      },
      {
        path: "/utility/single number sharing",
        element: <SingleNumberSharing />,
      },
      {
        path: "/utility/mission center",
        element: <MissionCenter />,
      },
      {
        path: "/utility/product report summary",
        element: <ProductReportSummary />,
      },
      {
        path: "/utility/rookie privacy form",
        element: <RookiePrivacyForm />,
      },
      {
        path: "/utility/logistic manager",
        element: <LogisticManager />,
      },
      {
        path: "/utility/order operation log",
        element: <OrderOperationLog />,
      },
      {
        path: "/utility/login log",
        element: <LoginLog />,
      },
    ],
  },
  // {
  //   path: "/实用工具",
  //   element: <UtilityLayout />,
  //   children: [
  //     {
  //       path: "/utility/related stores",
  //       element: <RelatedStores />,
  //     },
  //     {
  //       path: "/utility/order inquiry",
  //       element: <OrderInquiry />,
  //     },
  //     {
  //       path: "/utility/print record",
  //       element: <PrintRecord />,
  //     },
  //     {
  //       path: "/utility/delivery record",
  //       element: <DeliveryRecord />,
  //     },
  //     {
  //       path: "/utility/scan and ship",
  //       element: <ScanAndShip />,
  //     },
  //     {
  //       path: "/utility/automatic printing",
  //       element: <AutomaticPrinting />,
  //     },
  //     {
  //       path: "/utility/unusual order",
  //       element: <UnusualOrder />,
  //     },
  //     {
  //       path: "/utility/import order and ship",
  //       element: <ImportOrderAndShip />,
  //     },
  //     {
  //       path: "/utility/express reconciliation",
  //       element: <ExpressReconciliation />,
  //     },
  //     {
  //       path: "/utility/single number sharing",
  //       element: <SingleNumberSharing />,
  //     },
  //     {
  //       path: "/utility/mission center",
  //       element: <MissionCenter />,
  //     },
  //     {
  //       path: "/utility/product report summary",
  //       element: <ProductReportSummary />,
  //     },
  //     {
  //       path: "/utility/rookie privacy form",
  //       element: <RookiePrivacyForm />,
  //     },
  //     {
  //       path: "/utility/logistic manager",
  //       element: <LogisticManager />,
  //     },
  //     {
  //       path: "/utility/order operation log",
  //       element: <OrderOperationLog />,
  //     },
  //     {
  //       path: "/utility/login log",
  //       element: <LoginLog />,
  //     },
  //   ],
  // },
  {
    path: "/marketing",
    element: <MarketingLayout />,
    children: [
      {
        // path: "/marketing",
        index: true,
        element: <MarketingPage />,
      },
      {
        path: "/marketing/marketing",
        element: <MarketingPage />,
      },
      {
        path: "/marketing/transactions",
        element: <Transactions />,
      },
      {
        path: "/marketing/private domain",
        element: <PrivateDomain />,
      },
      {
        path: "/marketing/merchandise",
        element: <Merchandise />,
      },
      {
        path: "/marketing/shop",
        element: <Shop />,
      },
      {
        path: "/marketing/promotion",
        element: <Promotion />,
      },
      {
        path: "/marketing/delivery company",
        element: <DeliveryCompany />,
      },
      {
        path: "/marketing/customer service",
        element: <CustomerService />,
      },
      {
        path: "/marketing/content",
        element: <Content />,
      },
      {
        path: "/marketing/finance",
        element: <Finance />,
      },
      {
        path: "/marketing/transactions",
        element: <Transactions />,
      },
      {
        path: "/marketing/data",
        element: <MarketingData />,
      },
      {
        path: "/marketing/service",
        element: <MarketingService />,
      },
      {
        path: "/marketing/product application",
        element: <ProductApplication />,
      },
    ],
  },
  {
    path: "/pricing",
    element: (
      // <PrivateRoute>
      <Pricing />
      // </PrivateRoute>
    ),
  },
  {
    path: "/payment",
    element: <PaymentSystem />,
  },
  {
    path: "/success",
    element: <SuccessPage />,
  },
]);
