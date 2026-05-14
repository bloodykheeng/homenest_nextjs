// components/Header/menuData.ts
export type Menu = {
  id: number;
  title: string;
  path?: string;
  newTab: boolean;
  submenu?: Menu[];
};

export const menuData: Menu[] = [
  {
    id: 1,
    title: "Popular",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: "Shop",
    newTab: false,
    path: "/shop",
  },
  {
    id: 3,
    title: "About",
    newTab: false,
    path: "/about",
  },
  {
    id: 4,
    title: "FAQs",
    newTab: false,
    path: "/faqs",
  },
];