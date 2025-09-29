import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Login from "../pages/authentication/Login";
import Registration from "../pages/authentication/Registration";
import Home from "../pages/home/Home";
import Profile from "../pages/profile/Profile";
import Users from "../pages/users/Users";
import PrivateRouter from "./PrivateRouter";
import Settings from "../pages/settings/Settings";
import Packages from "../pages/packages/Packages";
import Staffs from "../pages/staffs/Staffs";
import AddPromoForm from "../pages/forms/AddPromoForm";
import UpdatePromoForm from "../pages/forms/UpdatePromoForm";
import AddStaffForm from "../pages/forms/AddStaffForm";
import UpdateStaffForm from "../pages/forms/UpdateStaffForm";
import AddSellerForm from "../pages/forms/AddSellerForm";
import UpdateSellerForm from "../pages/forms/UpdateSellerForm";
import AddPackageForm from "../pages/forms/AddPackageForm";
import UpdatePackageForm from "../pages/forms/UpdatePackageForm";
import AddRegionForm from "../pages/forms/AddRegionForm";
import UpdateRegionForm from "../pages/forms/UpdateRegionForm";
import Region from "../pages/packageRegion/Region";
import Country from "../pages/packageCountry/Country";
import AddCountryForm from "../pages/forms/AddCountryForm";
import UpdateCountryForm from "../pages/forms/UpdateCountryForm";
import Promo from "../pages/promos/Promos";
import ForgotPassword from "../pages/authentication/ForgotPassword";
import Revenue from "../pages/revenues/Revenues";
import Notification from "../pages/notifications/Notification";
import AddKeepgoPackageForm from "../pages/forms/AddKeepgoPackageForm";
import UpdateKeepgoPackageForm from "../pages/forms/UpdateKeepgoPackageForm";
import PackageKeepGo from "../pages/packages-keepgo/PackagesKeepgo";
import PopularCountry from "../pages/popularCountry/PopularCountry";
import PopularCountrySub from "../pages/popularCountry/PopularCountrySub";
import UpdatePopularCountryForm from "../pages/forms/UpdatePopularCountryForm";
import AddPopularCountryForm from "../pages/forms/AddPopularCountryForm";
import UserDetails from "../pages/users/UserDetails";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRouter>
        <Layout />
      </PrivateRouter>
    ),
    children: [
      {
        path: "/",
        element: (
          <PrivateRouter
            allowedRoles={[
              "manager",
              "sales-manager",
              "customer-manager",
              "admin",
            ]}
          >
            <Home />
          </PrivateRouter>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRouter
            allowedRoles={[
              "manager",
              "sales-manager",
              "customer-manager",
              "admin",
            ]}
          >
            <Profile />
          </PrivateRouter>
        ),
      },
      {
        path: "/users",
        element: (
          <PrivateRouter
            allowedRoles={[
              "manager",
              "sales-manager",
              "customer-manager",
              "admin",
            ]}
          >
            <Users />
          </PrivateRouter>
        ),
      },
      {
        path: "/users/:Id",
        element: (
          <PrivateRouter allowedRoles={["manager", "sales-manager", "admin"]}>
            <UserDetails />
          </PrivateRouter>
        ),
      },
      {
        path: "/packages",
        element: (
          <PrivateRouter allowedRoles={["manager", "sales-manager", "admin"]}>
            <Packages />
          </PrivateRouter>
        ),
      },
      {
        path: "/package-add",
        element: (
          <PrivateRouter allowedRoles={["manager", "sales-manager", "admin"]}>
            <AddPackageForm />
          </PrivateRouter>
        ),
      },
      {
        path: "/package-edit",
        element: (
          <PrivateRouter allowedRoles={["manager", "sales-manager", "admin"]}>
            <UpdatePackageForm />
          </PrivateRouter>
        ),
      },
      {
        path: "/package-regions",
        element: (
          <PrivateRouter allowedRoles={["manager", "sales-manager", "admin"]}>
            {/* <PackageRegion /> */}
            <Region />
          </PrivateRouter>
        ),
      },
      {
        path: "/package-region-add",
        element: (
          <PrivateRouter allowedRoles={["manager", "sales-manager", "admin"]}>
            <AddRegionForm />
          </PrivateRouter>
        ),
      },
      {
        path: "/package-region-edit",
        element: (
          <PrivateRouter allowedRoles={["manager", "sales-manager", "admin"]}>
            <UpdateRegionForm />
          </PrivateRouter>
        ),
      },
      {
        path: "/popular-country",
        element: (
          <PrivateRouter allowedRoles={["manager", "sales-manager", "admin"]}>
            <PopularCountry />
          </PrivateRouter>
        ),
      },
      {
        path: "/popular-country/:Id",
        element: (
          <PrivateRouter allowedRoles={["manager", "sales-manager", "admin"]}>
            <PopularCountrySub />
          </PrivateRouter>
        ),
      },
      {
        path: "/popular-country-add",
        element: (
          <PrivateRouter allowedRoles={["manager", "sales-manager", "admin"]}>
            <AddPopularCountryForm />
          </PrivateRouter>
        ),
      },
      {
        path: "/popular-country-edit",
        element: (
          <PrivateRouter allowedRoles={["manager", "sales-manager", "admin"]}>
            <UpdatePopularCountryForm />
          </PrivateRouter>
        ),
      },
      {
        path: "/package-countries",
        element: (
          <PrivateRouter allowedRoles={["manager", "sales-manager", "admin"]}>
            <Country />
          </PrivateRouter>
        ),
      },
      {
        path: "/package-country-add",
        element: (
          <PrivateRouter allowedRoles={["manager", "sales-manager", "admin"]}>
            <AddCountryForm />
          </PrivateRouter>
        ),
      },
      {
        path: "/package-country-edit",
        element: (
          <PrivateRouter allowedRoles={["manager", "sales-manager", "admin"]}>
            <UpdateCountryForm />
          </PrivateRouter>
        ),
      },
      {
        path: "/keepgo-packages",
        element: (
          <PrivateRouter allowedRoles={["manager", "sales-manager", "admin"]}>
            <PackageKeepGo />
          </PrivateRouter>
        ),
      },
      {
        path: "/keepgo-package-add",
        element: (
          <PrivateRouter allowedRoles={["manager", "sales-manager", "admin"]}>
            <AddKeepgoPackageForm />
          </PrivateRouter>
        ),
      },
      {
        path: "/keepgo-package-edit",
        element: (
          <PrivateRouter allowedRoles={["manager", "sales-manager", "admin"]}>
            <UpdateKeepgoPackageForm />
          </PrivateRouter>
        ),
      },
      {
        path: "/seller-add",
        element: (
          <PrivateRouter allowedRoles={["manager", "sales-manager", "admin"]}>
            <AddSellerForm />
          </PrivateRouter>
        ),
      },
      {
        path: "/seller-edit",
        element: (
          <PrivateRouter allowedRoles={["manager", "sales-manager", "admin"]}>
            <UpdateSellerForm />
          </PrivateRouter>
        ),
      },
      {
        path: "/promo",
        element: (
          <PrivateRouter
            allowedRoles={[
              "manager",
              "sales-manager",
              "customer-manager",
              "admin",
            ]}
          >
            <Promo />
          </PrivateRouter>
        ),
      },
      {
        path: "/promo-add",
        element: (
          <PrivateRouter
            allowedRoles={[
              "manager",
              "sales-manager",
              "customer-manager",
              "admin",
            ]}
          >
            <AddPromoForm />
          </PrivateRouter>
        ),
      },
      {
        path: "/promo-edit",
        element: (
          <PrivateRouter
            allowedRoles={[
              "manager",
              "sales-manager",
              "customer-manager",
              "admin",
            ]}
          >
            <UpdatePromoForm />
          </PrivateRouter>
        ),
      },
      {
        path: "/revenue",
        element: (
          <PrivateRouter allowedRoles={["sales-manager", "admin"]}>
            <Revenue />
          </PrivateRouter>
        ),
      },
      {
        path: "/notification",
        element: (
          <PrivateRouter allowedRoles={["manager", "sales-manager", "admin"]}>
            <Notification />
          </PrivateRouter>
        ),
      },
      // Public routes for authenticated users
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/api-key",
        element: <Settings />,
      },
      // Restricted routes
      {
        path: "/staffs",
        element: (
          <PrivateRouter allowedRoles={["admin"]}>
            <Staffs />
          </PrivateRouter>
        ),
      },
      {
        path: "/staff-add",
        element: (
          <PrivateRouter allowedRoles={["admin"]}>
            <AddStaffForm />
          </PrivateRouter>
        ),
      },
      {
        path: "/staff-edit",
        element: (
          <PrivateRouter allowedRoles={["admin"]}>
            <UpdateStaffForm />
          </PrivateRouter>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: `/register/${import.meta.env.VITE_REGISTRATION_RANDOM_STRING}`,
    element: <Registration />,
  },
  {
    path: "/unauthorized",
    element: (
      <h2 className="font-black py-6 text-3xl text-red-600 text-center">
        Unauthorized Access!
      </h2>
    ),
  },
  {
    path: "*",
    element: (
      <h2 className="font-black py-6 text-3xl text-red-600 text-center">
        Page Not Found!
      </h2>
    ),
  },
]);
