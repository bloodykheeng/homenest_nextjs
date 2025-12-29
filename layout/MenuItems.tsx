import {
  RxDashboard,
  RxBell,
  RxPerson,
  RxGear,
  RxMixerVertical,
  RxBookmark,
  RxStack,
} from "react-icons/rx";

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
          ],
        },

        {
          icon: <RxBell />,
          name: "Notifications",
          path: "/dashboard/notifications",
        },

        {
          icon: <RxPerson />,
          name: "Users",
          path: "/dashboard/users",
        },
        {
          icon: <RxGear />,
          name: "Settings",
          subItems: [
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
      ],
    },
  ];

  return menuItems;
};
