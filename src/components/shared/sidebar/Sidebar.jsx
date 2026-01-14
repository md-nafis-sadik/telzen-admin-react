import React, { useCallback, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { logo } from "../../../assets/getAssets";
import { favicon } from "../../../assets/getAssets";
import { useDispatch, useSelector } from "react-redux";
import "./sidebar.css";
import InactiveDashboardIcon from "../../../assets/svgs/InactiveDashboardIcon";
import ActiveDashboardIcon from "../../../assets/svgs/ActiveDashboardIcon";
import InactiveUserIcon from "../../../assets/svgs/InactiveUserIcon";
import ActiveUserIcon from "../../../assets/svgs/ActiveUserIcon";
import ActiveNotificationIcon from "../../../assets/svgs/ActiveNotificationIcon";
import InactiveNotificationIcon from "../../../assets/svgs/InactiveNotificationIcon";
import ActiveSettingIcon from "../../../assets/svgs/ActiveSettingIcon";
import InactiveSettingIcon from "../../../assets/svgs/InactiveSettingIcon";
import ActivePackageIcon from "../../../assets/svgs/ActivePackageIcon";
import InactivePackageIcon from "../../../assets/svgs/InactivePackageIcon";
import ActiveCouponIcon from "../../../assets/svgs/ActiveCouponIcon";
import InactiveCouponIcon from "../../../assets/svgs/InactiveCouponIcon";
import ActiveStaffIcon from "../../../assets/svgs/ActiveStaffIcon";
import InactiveStaffIcon from "../../../assets/svgs/InactiveStaffIcon";
import ActiveRevenueIcon from "../../../assets/svgs/ActiveRevenueIcon";
import InactiveRevenueIcon from "../../../assets/svgs/InactiveRevenueIcon";
import ActiveBusinessIcon from "../../../assets/svgs/ActiveBusinessIcon";
import InactiveBusinessIcon from "../../../assets/svgs/InactiveBusinessIcon";
import { logout } from "../../../features/auth/authSlice";
import { setActivePath } from "../../../features/nav/navSlice";
import LogoutModal from "../../modals/LogoutModal";

function Sidebar({ showSidebar, setShowSidebar }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { auth } = useSelector((state) => state.auth);
  const submenuRef = useRef({});
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(() => {
    const path = window.location.pathname.split("/").filter(Boolean)[0] || "/";
    const isPackagesOpen = [
      "packages",
      "packages",
      "package-regions",
      "package-countries",
      "popular-country",
    ].includes(path);
    const isBusinessOpen = ["business"].includes(path);

    return { packages: isPackagesOpen, business: isBusinessOpen };
  });
  const activePath = location.pathname.split("/").filter(Boolean)[0] || "/";
  const isPackagesActive = [
    "packages",
    "packages",
    "package-regions",
    "package-countries",
    "popular-country",
  ].includes(activePath);
  const isBusinessActive = ["business"].includes(activePath);

  const submenuStyle = {
    maxHeight: isSubmenuOpen["packages"] && showSidebar ? "1000px" : "0",
    transition: "max-height 300ms ease-in-out",
    overflow: "hidden",
    willChange: "max-height",
  };

  const businessSubmenuStyle = {
    maxHeight: isSubmenuOpen["business"] && showSidebar ? "1000px" : "0",
    transition: "max-height 300ms ease-in-out",
    overflow: "hidden",
    willChange: "max-height",
  };

  const handleDropdown = useCallback(
    (menu) => {
      setIsSubmenuOpen((prev) => {
        const currentState = prev[menu] || false;
        return { [menu]: !currentState };
      });

      if (!showSidebar) setShowSidebar(true);
    },
    [showSidebar]
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div
      className={`sidebar bg-white h-full overflow-auto flex flex-col justify-between border-r border-border-color transition-all duration-500 ease-in-out fixed !z-[60] top-0 xl:relative 
    ${
      showSidebar
        ? "left-0 xl:left-auto xl:w-[270px]"
        : "-left-[100%] xl:left-auto xl:w-[88px]"
    }`}
    >
      <div className="w-full px-4 py-4 whitespace-nowrap shrink-0 font-medium">
        <div
          className={`flex items-center sticky top-0 py-3 bg-white transition-all duration-300 ease-in-out ${
            showSidebar ? "justify-start" : "justify-center"
          }`}
        >
          {/* Replace both images with this */}
          <div
            className={`relative h-[32px] ${
              showSidebar ? "w-[144px]" : "w-[32px]"
            }`}
          >
            <img
              src={logo}
              className={`absolute inset-0 transition-all duration-300 ${
                showSidebar
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-90 pointer-events-none"
              }`}
              style={{
                transformOrigin: "left center",
                willChange: "transform, opacity", // GPU acceleration
              }}
            />
            <img
              src={favicon}
              className={`absolute inset-0 transition-all duration-300 ${
                !showSidebar
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-90 pointer-events-none"
              }`}
              style={{
                transformOrigin: "center",
                willChange: "transform, opacity",
              }}
            />
          </div>
        </div>

        {/* nav items  */}
        <div className="mt-12 overflow-x-hidden"></div>

        <ul className="flex flex-col overflow-y-auto">
          {/* dashboard  */}
          <li>
            <Link
              to="/"
              className={`${
                activePath === "/" ? "active py-3 pr-4" : "p-4 pl-5"
              } flex items-center gap-4 w-full rounded-lg`}
              onClick={() => {
                dispatch(setActivePath("/"));
                setIsSubmenuOpen({});
              }}
            >
              {activePath === "/" && (
                <div className="border-2 rounded-full border-main-500 w-1 h-[24px] bg-main-500"></div>
              )}
              {activePath === "/" ? (
                <ActiveDashboardIcon className="shrink-0" />
              ) : (
                <InactiveDashboardIcon className="shrink-0" />
              )}
              <span className={`duration-300 ${showSidebar ? "" : "hidden"}`}>
                Dashboard
              </span>
            </Link>
          </li>

          {/* Users */}

          <li>
            <Link
              to="/users"
              className={`${
                activePath === "users" ? "active py-3 pr-4" : "p-4 pl-5"
              } flex items-center gap-4 w-full rounded-lg`}
              onClick={() => {
                dispatch(setActivePath("users"));
                setIsSubmenuOpen({});
              }}
            >
              {activePath === "users" && (
                <div className="border-2 rounded-full border-main-500 w-1 h-[24px] bg-main-500"></div>
              )}
              {activePath === "users" ? (
                <ActiveUserIcon className="shrink-0" />
              ) : (
                <InactiveUserIcon className="shrink-0" />
              )}

              <span className={`duration-300 ${showSidebar ? "" : "hidden"}`}>
                Users
              </span>
            </Link>
          </li>

          {/* Business */}
          <li>
            <div
              className={`${
                isBusinessActive ? "active py-3 pr-4" : "p-4 pl-5"
              } flex items-center gap-4 w-full rounded-lg cursor-pointer`}
              onClick={() => {
                if (!showSidebar) {
                  setShowSidebar(true);
                }
                handleDropdown("business");
              }}
            >
              {isBusinessActive && (
                <div className="border-2 rounded-full border-main-500 w-1 h-[24px] bg-main-500"></div>
              )}
              {isBusinessActive ? (
                <ActiveBusinessIcon className="shrink-0" />
              ) : (
                <InactiveBusinessIcon className="shrink-0" />
              )}

              <span className={`duration-300 ${showSidebar ? "" : "hidden"}`}>
                Business
              </span>

              {/* Dropdown icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`ml-auto transform transition-transform ${
                  isSubmenuOpen["business"] ? "rotate-180" : ""
                }`}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M19 9L12 16L5 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Submenu */}
            <div
              ref={(ref) => (submenuRef.current["business"] = ref)}
              className="flex flex-col ml-8"
              style={businessSubmenuStyle}
            >
              {/* Active */}
              <div>
                <Link
                  to="/business/active"
                  className={`${
                    location.pathname === "/business/active"
                      ? "py-3 pl-6 font-medium text-main-500"
                      : "py-3 pl-6"
                  } flex items-center gap-4 w-full rounded-lg`}
                  onClick={() => dispatch(setActivePath("business"))}
                >
                  <span
                    className={`duration-300 ${showSidebar ? "" : "hidden"}`}
                  >
                    Active
                  </span>
                </Link>
              </div>

              {/* Pending */}
              <div>
                <Link
                  to="/business/pending"
                  className={`${
                    location.pathname === "/business/pending"
                      ? "py-3 pl-6 font-medium text-main-500"
                      : "py-3 pl-6"
                  } flex items-center gap-4 w-full rounded-lg`}
                  onClick={() => dispatch(setActivePath("business"))}
                >
                  <span
                    className={`duration-300 ${showSidebar ? "" : "hidden"}`}
                  >
                    Pending
                  </span>
                </Link>
              </div>
            </div>
          </li>

          {/* Packages(Setup */}

          {/* Packages Menu */}
          {(auth.role === "manager" ||
            auth.role === "sales-manager" ||
            auth.role === "admin") && (
            <li>
              {/* Changed from Link to div */}
              <div
                className={`${
                  isPackagesActive ? "active py-3 pr-4" : "p-4 pl-5"
                } flex items-center gap-4 w-full rounded-lg cursor-pointer`}
                onClick={() => {
                  if (!showSidebar) {
                    setShowSidebar(true);
                  }
                  handleDropdown("packages");
                }}
              >
                {isPackagesActive && (
                  <div className="border-2 rounded-full border-main-500 w-1 h-[24px] bg-main-500"></div>
                )}
                {isPackagesActive ? (
                  <ActivePackageIcon className="shrink-0" />
                ) : (
                  <InactivePackageIcon className="shrink-0" />
                )}

                <span className={`duration-300 ${showSidebar ? "" : "hidden"}`}>
                  Packages
                </span>

                {/* Dropdown icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`ml-auto transform transition-transform ${
                    isSubmenuOpen["packages"] ? "rotate-180" : ""
                  }`}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M19 9L12 16L5 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Submenu */}
              <div
                ref={(ref) => (submenuRef.current["packages"] = ref)}
                className="flex flex-col ml-8"
                style={submenuStyle}
              >
                {/* Regions */}
                {auth.role === "admin" && (
                  <div>
                    <Link
                      to="/package-regions"
                      className={`${
                        activePath === "package-regions"
                          ? "py-3 pl-6 font-medium text-main-500"
                          : "py-3 pl-6"
                      } flex items-center gap-4 w-full rounded-lg`}
                      onClick={() => dispatch(setActivePath("package-regions"))}
                    >
                      <span
                        className={`duration-300 ${
                          showSidebar ? "" : "hidden"
                        }`}
                      >
                        Region
                      </span>
                    </Link>
                  </div>
                )}

                {/* Countries */}
                {auth.role === "admin" && (
                  <div>
                    <Link
                      to="/package-countries"
                      className={`${
                        activePath === "package-countries"
                          ? "py-3 pl-6 font-medium text-main-500"
                          : "py-3 pl-6"
                      } flex items-center gap-4 w-full rounded-lg`}
                      onClick={() =>
                        dispatch(setActivePath("package-countries"))
                      }
                    >
                      <span
                        className={`duration-300 ${
                          showSidebar ? "" : "hidden"
                        }`}
                      >
                        Country
                      </span>
                    </Link>
                  </div>
                )}
                {/* Popular Country */}
                <div>
                  <Link
                    to="/popular-country"
                    className={`${
                      activePath === "popular-country"
                        ? "py-3 pl-6 font-medium text-main-500"
                        : "py-3 pl-6"
                    } flex items-center gap-4 w-full rounded-lg`}
                    onClick={() => dispatch(setActivePath("popular-country"))}
                  >
                    <span
                      className={`duration-300 ${showSidebar ? "" : "hidden"}`}
                    >
                      Popular Country
                    </span>
                  </Link>
                </div>

                {/* Packages Old */}
                {/* <div>
                  <Link
                    to="/packages"
                    className={`${
                      activePath === "packages"
                        ? "py-3 pl-6 font-medium text-main-500"
                        : "py-3 pl-6"
                    } flex items-center gap-4 w-full rounded-lg`}
                    onClick={() => dispatch(setActivePath("packages"))}
                  >
                    <span
                      className={`duration-300 ${showSidebar ? "" : "hidden"}`}
                    >
                      Packages(Old)
                    </span>
                  </Link>
                </div> */}

                {/* Packages Keepgo */}
                <div>
                  <Link
                    to="/packages"
                    className={`${
                      activePath === "packages"
                        ? "py-3 pl-6 font-medium text-main-500"
                        : "py-3 pl-6"
                    } flex items-center gap-4 w-full rounded-lg`}
                    onClick={() => dispatch(setActivePath("packages"))}
                  >
                    <span
                      className={`duration-300 ${showSidebar ? "" : "hidden"}`}
                    >
                      Packages
                    </span>
                  </Link>
                </div>
              </div>
            </li>
          )}

          {/* Sellers Setup */}
          {/* {(auth.role === "manager" ||
            auth.role === "sales-manager" ||
            auth.role === "admin") && (
            <li>
              <div>
                <Link
                  to="/sellers"
                  className={`${
                    activePath === "sellers" ? "active py-3 pr-4" : "p-4 pl-5"
                  } flex items-center gap-4 w-full rounded-lg`}
                  onClick={() => {
                    handleLocalstore("sellers");
                    setIsSubmenuOpen((prev) => !prev);
                  }}
                >
                  {activePath === "sellers" && (
                    <div className="border-2 rounded-full border-main-500 w-1 h-[24px] bg-main-500"></div>
                  )}
                  {activePath === "sellers" ? (
                    <ActiveSellerIcon />
                  ) : (
                    <InactiveSellerIcon />
                  )}

                  <span
                    className={`duration-300 ${showSidebar ? "" : "hidden"}`}
                  >
                    Sellers
                  </span>
                </Link>
              </div>
            </li>
          )} */}

          {/* Packages(Vendor 3) Setup */}

          <li>
            <div>
              <Link
                to="/coupon"
                className={`${
                  activePath === "coupon" ? "active py-3 pr-4" : "p-4 pl-5"
                } flex items-center gap-4 w-full rounded-lg`}
                onClick={() => {
                  dispatch(setActivePath("coupon"));
                  setIsSubmenuOpen({});
                }}
              >
                {activePath === "coupon" && (
                  <div className="border-2 rounded-full border-main-500 w-1 h-[24px] bg-main-500"></div>
                )}
                {activePath === "coupon" ? (
                  <ActiveCouponIcon className="shrink-0" />
                ) : (
                  <InactiveCouponIcon className="shrink-0" />
                )}

                <span className={`duration-300 ${showSidebar ? "" : "hidden"}`}>
                  Coupon
                </span>
              </Link>
            </div>
          </li>

          {/* Settings */}

          {(auth.role === "sales-manager" || auth.role === "admin") && (
            <li>
              <Link
                to="/revenue"
                className={`${
                  activePath === "revenue" ? "active py-3 pr-4" : "p-4 pl-5"
                } flex items-center gap-4 w-full rounded-lg`}
                onClick={() => {
                  dispatch(setActivePath("revenue"));
                  setIsSubmenuOpen({});
                }}
              >
                {activePath === "revenue" && (
                  <div className="border-2 rounded-full border-main-500 w-1 h-[24px] bg-main-500"></div>
                )}
                {activePath === "revenue" ? (
                  <ActiveRevenueIcon className="shrink-0" />
                ) : (
                  <InactiveRevenueIcon className="shrink-0" />
                )}

                <span className={`duration-300 ${showSidebar ? "" : "hidden"}`}>
                  Revenue
                </span>
              </Link>
            </li>
          )}

          {/* Notification  */}
          {(auth.role === "manager" ||
            auth.role === "sales-manager" ||
            auth.role === "admin") && (
            <li>
              <div>
                <Link
                  to="/notification"
                  className={`${
                    activePath === "notification"
                      ? "active py-3 pr-4"
                      : "p-4 pl-5"
                  } flex items-center gap-4 w-full rounded-lg`}
                  onClick={() => {
                    dispatch(setActivePath("notification"));
                    setIsSubmenuOpen({});
                  }}
                >
                  {activePath === "notification" && (
                    <div className="border-2 rounded-full border-main-500 w-1 h-[24px] bg-main-500"></div>
                  )}
                  {activePath === "notification" ? (
                    <ActiveNotificationIcon className="shrink-0" />
                  ) : (
                    <InactiveNotificationIcon className="shrink-0" />
                  )}

                  <span
                    className={`duration-300 ${showSidebar ? "" : "hidden"}`}
                  >
                    Notifications
                  </span>
                </Link>
              </div>
            </li>
          )}

          {/* Header Setup  */}
          {auth.role === "admin" && (
            <li>
              <Link
                to="/staffs"
                className={`${
                  activePath === "staffs" ? "active py-3 pr-4" : "p-4 pl-5"
                } flex items-center gap-4 w-full rounded-lg`}
                onClick={() => {
                  dispatch(setActivePath("staffs"));
                  setIsSubmenuOpen({});
                }}
              >
                {activePath === "staffs" && (
                  <div className="border-2 rounded-full border-main-500 w-1 h-[24px] bg-main-500"></div>
                )}
                {activePath === "staffs" ? (
                  <ActiveStaffIcon className="shrink-0" />
                ) : (
                  <InactiveStaffIcon className="shrink-0" />
                )}

                <span className={`duration-300 ${showSidebar ? "" : "hidden"}`}>
                  Staffs
                </span>
              </Link>
            </li>
          )}

          {/* Api Key Setup */}

          <li>
            <div>
              <Link
                to="/settings"
                className={`${
                  activePath === "settings" ? "active py-3 pr-4" : "p-4 pl-5"
                } flex items-center gap-4 w-full rounded-lg`}
                onClick={() => {
                  dispatch(setActivePath("settings"));
                  setIsSubmenuOpen({});
                }}
              >
                {activePath === "settings" && (
                  <div className="border-2 rounded-full border-main-500 w-1 h-[24px] bg-main-500"></div>
                )}
                {activePath === "settings" ? (
                  <ActiveSettingIcon className="shrink-0" />
                ) : (
                  <InactiveSettingIcon className="shrink-0" />
                )}

                <span className={`duration-300 ${showSidebar ? "" : "hidden"}`}>
                  Settings
                </span>
              </Link>
            </div>
          </li>
        </ul>
      </div>
      <div className="sticky bottom-0 bg-white pt-3 pb-4 px-5 w-full">
        {/* <Link
          to="/"
          className="py-2 px-4 border-t border-border-color flex items-center gap-4 text-sm"
        > */}
        <label
          htmlFor="logoutPopup"
          className="py-2 px-4 border-t border-border-color flex items-center gap-4 text-sm cursor-pointer"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M12.1667 4.66667L10.9917 5.84167L12.3083 7.16667H5.5V8.83333H12.3083L10.9917 10.15L12.1667 11.3333L15.5 8L12.1667 4.66667ZM2.16667 2.16667H8V0.5H2.16667C1.25 0.5 0.5 1.25 0.5 2.16667V13.8333C0.5 14.75 1.25 15.5 2.16667 15.5H8V13.8333H2.16667V2.16667Z"
                fill="#616161"
              />
            </svg>
          </span>
          <span
            className={`duration-300 whitespace-nowrap ${
              showSidebar ? "" : "hidden"
            }`}
          >
            Log Out
          </span>
        </label>
        {/* </Link> */}
        <LogoutModal handleStatus={handleLogout} title="Logout" />
      </div>
    </div>
  );
}

export default Sidebar;
