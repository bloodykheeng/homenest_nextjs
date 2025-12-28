import {
  RxDashboard,
  RxClipboard,
  RxBell,
  RxPerson,
  RxGear,
  RxPinTop,
  RxTarget,
  RxMixerVertical,
  RxBookmark,
  RxLayers,
  RxStack,
  RxComponent1,
  RxShuffle,
  RxReader
} from "react-icons/rx";

import {
  FiMap,
  FiBriefcase,
  FiMapPin,
  FiGlobe,
  FiTrendingUp,
  FiHome,
  FiPackage,
} from "react-icons/fi";

import { FaPoll, FaChartBar, FaOutdent, FaIndent, FaMoneyBillWave, FaUmbrellaBeach, } from "react-icons/fa";


import { BsBarChart } from "react-icons/bs";

// Type definitions for menu items
interface NestedMenuItem {
  icon: React.ReactNode;
  name: string;
  path?: string; // make optional
  pro?: boolean;
  subItems?: NestedMenuItem[]; // allow deeper nesting
}

interface SubMenuItem {
  icon: React.ReactNode;
  name: string;
  path?: string;
  pro?: boolean;
  subItems?: NestedMenuItem[];
}

export interface MenuItem {
  icon: React.ReactNode;
  name: string;
  path?: string;
  subItems?: SubMenuItem[];
}

// MenuItems.ts
export interface SidebarItem {
  icon: React.ReactNode;
  name: string;
  path?: string;
  pro?: boolean;
  subItems?: SidebarItem[]; // recursive
}

export interface MenuCategory {
  category: string;
  menu: string;
  items: SidebarItem[];
}

export const getMenuItems = (logggedInUser: any): MenuCategory[] => {
  const logggedInUserRole = logggedInUser?.role;

  const systemAdminRoles = ["System Admin"];

  const ppdaRoles = ["PPDA Admin", "PPDA Officer"];

  const CsoRoles = ["CSO Admin", "CSO Monitor", "CSO Verifier", "CSO Approver"];

  const menuItems: MenuCategory[] = [
    {
      category: "main",
      menu: "Main Menu",
      items: [

        {
          icon: <RxDashboard />,
          name: "Dashboard",
          path: "/dashboard",
        },

        {
          icon: <BsBarChart />,
          name: "Statistics",
          subItems: [
            {
              icon: <FaIndent />,
              name: "Sell-in Statistics",
              subItems: [
                {
                  icon: <FaChartBar />,
                  name: "Sell-in Charts",
                  path: "/dashboard/sellin-charts",
                },
              ],
            },
            {
              icon: <FaOutdent />,
              name: "Sell-out Statistics",
              subItems: [
                {
                  icon: <FaChartBar />,
                  name: "Sell-out Charts",
                  path: "/dashboard/sellout-charts",
                },
              ],
            },
          ],
        },

        {
          icon: <FiBriefcase />,
          name: "Sell In",
          subItems: [
            {
              icon: <RxPerson />,
              name: "Agents",
              path: "/dashboard/agents",
            },
            {
              icon: <RxTarget />,
              name: "Agent Visits",
              path: "/dashboard/agent-visits",
            },
            {
              icon: <RxClipboard />,
              name: "Orders",
              path: "/dashboard/sellin-orders",
            },
            {
              icon: <i className="pi pi-credit-card" />, // ✅ transaction-like icon
              name: "Sellin Transactions",
              path: "/dashboard/sellin-transactions",
            },
            {
              icon: <i className="pi pi-calculator" />,
              name: "Agent Stock Counts",
              path: "/dashboard/agent-stock-counts",
            },
            {
              icon: <i className="pi pi-calendar" />, // ✅ calendar icon fits journey planning
              name: "Journey Plans",
              path: "/dashboard/sellin-journey-plans",
            },
          ],
        },
        {
          icon: <FiBriefcase />,
          name: "Sell Out",
          subItems: [
            {
              icon: <RxPerson />,
              name: "Customers",
              path: "/dashboard/customers",
            },
            {
              icon: <RxTarget />,
              name: "Customer Visits",
              path: "/dashboard/customer-visits",
            },
            {
              icon: <RxClipboard />,
              name: "Orders",
              path: "/dashboard/sellout-orders",
            },
            {
              icon: <i className="pi pi-credit-card" />,
              name: "Sellout Transactions",
              path: "/dashboard/sellout-order-transactions",
            },
            {
              icon: <i className="pi pi-calculator" />,
              name: "Customer Stock Counts",
              path: "/dashboard/customer-stock-counts",
            },
            {
              icon: <i className="pi pi-box" />,
              name: "Customer Merchandises",
              path: "/dashboard/customer-merchandises",
            },
            {
              icon: <i className="pi pi-calendar" />, // ✅ calendar icon fits journey planning
              name: "Journey Plans",
              path: "/dashboard/sellout-journey-plans",
            },
          ],
        },
        {
          icon: <RxStack />,
          name: "Products",
          subItems: [
            {
              icon: <i className="pi pi-tags" />,
              name: "Categories",
              path: "/dashboard/product-categories",
            },
            {
              icon: <i className="pi pi-tag" />,
              name: "Sub Categories",
              path: "/dashboard/product-subcategories",
            },
            {
              icon: <i className="pi pi-shopping-cart" />,
              name: "Products",
              path: "/dashboard/products",
            },
            {
              icon: <i className="pi pi-tags" />, // 🏷️ appropriate for price groups
              name: "Product Price Groups",
              path: "/dashboard/product-price-groups",
            },
          ],
        },
        {
          icon: <RxClipboard />,
          name: "Surveys",
          path: "/dashboard/surveys",
        },
        {
          icon: <FaPoll />,
          name: "Survey Responses",
          path: "/dashboard/survey-responses",
        },

        {
          icon: <RxBell />,
          name: "Notifications",
          path: "/dashboard/notifications",
        },
        {
          icon: <FaMoneyBillWave />,   // or any icon you prefer
          name: "Expenses",
          path: "/dashboard/expenses",
        },

        {
          icon: <FaUmbrellaBeach />,   // or any icon you prefer
          name: "Days Off",
          path: "/dashboard/days-off",
        },

        {
          icon: <RxPerson />,
          name: "Users",
          path: "/dashboard/users",
        },
        {
          icon: <RxTarget />,
          name: "Targets",
          path: "/dashboard/targets",
        },
        {
          icon: <RxGear />,
          name: "Settings",
          subItems: [
            {
              icon: <FiMap />,
              name: "Location",
              subItems: [
                {
                  name: "Administrative",
                  icon: <RxMixerVertical />,
                  subItems: [
                    {
                      name: "Channels",
                      icon: <RxMixerVertical />,
                      path: "/dashboard/channels",
                    },
                    {
                      name: "Regions",
                      icon: <FiGlobe />,
                      path: "/dashboard/regions",
                    },
                    {
                      name: "Territories",
                      icon: <RxLayers />,
                      path: "/dashboard/territories",
                    },
                    {
                      name: "Routes",
                      icon: <FiTrendingUp />,
                      path: "/dashboard/routes",
                    },
                  ],
                },
                {
                  name: "Geographical",
                  icon: <FiMapPin />,
                  subItems: [
                    {
                      name: "Districts",
                      icon: <FiMap />,
                      path: "/dashboard/districts",
                    },
                    {
                      name: "Counties",
                      icon: <RxComponent1 />,
                      path: "/dashboard/counties",
                    },
                    {
                      name: "Subcounties",
                      icon: <RxStack />,
                      path: "/dashboard/subcounties",
                    },
                    {
                      name: "Parishes",
                      icon: <FiMapPin />,
                      path: "/dashboard/parishes",
                    },
                    {
                      name: "Villages",
                      icon: <FiHome />,
                      path: "/dashboard/villages",
                    },
                  ],
                },
              ],
            },
            {
              name: "Expense Types",
              icon: <RxReader />,
              path: "/dashboard/expense-types",
            },
            {
              name: "Price Groups",
              icon: <RxBookmark />,
              path: "/dashboard/price-groups",
            },
            {
              name: "Roles",
              icon: <RxMixerVertical />,
              path: "/dashboard/roles",
            },
            {
              name: "Queues",
              icon: <RxStack />,
              path: "/dashboard/queues",
            },
            {
              name: "Audit Trail",
              icon: <RxBookmark />,
              path: "/dashboard/audit-trail",
            },
          ],
        },

        {
          icon: <RxBookmark />,
          name: "User Manual",
          path: "/dashboard/user-manual",
        },
      ],
    },
  ];

  return menuItems;
};
