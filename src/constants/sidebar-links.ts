import {
  IconBook2,
  IconBrandAuth0,
  IconBriefcase,
  IconCalendar,
  IconChartArcs3,
  IconChartBar,
  IconChartInfographic,
  IconExclamationCircle,
  IconFileInvoice,
  IconFiles,
  IconLayersSubtract,
  IconLifebuoy,
  IconList,
  IconListDetails,
  IconLogin2,
  IconMessages,
  IconPackages,
  IconReceipt2,
  IconRotateRectangle,
  IconUserCircle,
  IconUserCode,
  IconUserPlus,
  IconUserShield,
  IconShoppingCart,
  IconUsers,
  IconCoin,
  IconSpeakerphone,
  IconStethoscope,
  IconSchool,
  IconTruckDelivery,
  IconUserCog,
  IconBuilding,
  IconRobot,
  IconBell,
} from '@tabler/icons-react';

import { PATH_ABOUT, PATH_APPS, PATH_AUTH, PATH_DASHBOARD, PATH_DOCS, PATH_PAGES } from '@/routes';

export const SIDEBAR_LINKS = [
  {
    title: 'Dashboard',
    links: [
      { label: 'Default', icon: IconChartBar, link: PATH_DASHBOARD.default },
      {
        label: 'Analytics',
        icon: IconChartInfographic,
        link: PATH_DASHBOARD.analytics,
      },
      { label: 'SaaS', icon: IconChartArcs3, link: PATH_DASHBOARD.saas },
      { label: 'E-commerce', icon: IconShoppingCart, link: PATH_DASHBOARD.ecommerce },
      { label: 'CRM', icon: IconUsers, link: PATH_DASHBOARD.crm },
      { label: 'Finance', icon: IconCoin, link: PATH_DASHBOARD.finance },
      { label: 'Marketing', icon: IconSpeakerphone, link: PATH_DASHBOARD.marketing, badge: 'NEW' },
      { label: 'Healthcare', icon: IconStethoscope, link: PATH_DASHBOARD.healthcare, badge: 'NEW' },
      { label: 'Education', icon: IconSchool, link: PATH_DASHBOARD.education, badge: 'NEW' },
      { label: 'Logistics', icon: IconTruckDelivery, link: PATH_DASHBOARD.logistics, badge: 'NEW' },
      { label: 'HR', icon: IconUserCog, link: PATH_DASHBOARD.hr, badge: 'NEW' },
      { label: 'Real Estate', icon: IconBuilding, link: PATH_DASHBOARD.realEstate, badge: 'NEW' },
      { label: 'LLM/AI', icon: IconRobot, link: PATH_DASHBOARD.llm, badge: 'NEW' },
    ],
  },
  {
    title: 'Apps',
    links: [
      { label: 'Profile', icon: IconUserCircle, link: PATH_APPS.profile },
      { label: 'Settings', icon: IconUserCode, link: PATH_APPS.settings },
      { label: 'Chat', icon: IconMessages, link: PATH_APPS.chat },
      { label: 'Projects', icon: IconBriefcase, link: PATH_APPS.projects },
      { label: 'Orders', icon: IconListDetails, link: PATH_APPS.orders },
      { label: 'Customers', icon: IconUsers, link: PATH_APPS.customers, badge: 'NEW' },
      { label: 'Email', icon: IconMessages, link: PATH_APPS.email, badge: 'NEW' },
      { label: 'Notifications', icon: IconBell, link: PATH_APPS.notifications, badge: 'NEW' },
      {
        label: 'Invoices',
        icon: IconFileInvoice,
        links: [
          {
            label: 'List',
            link: PATH_APPS.invoices.root,
          },
          {
            label: 'Details',
            link: PATH_APPS.invoices.sample,
          },
        ],
      },
      { label: 'Tasks', icon: IconListDetails, link: PATH_APPS.tasks },
      { label: 'Calendar', icon: IconCalendar, link: PATH_APPS.calendar },
      {
        label: 'File Manager',
        icon: IconFiles,
        link: PATH_APPS.fileManager.root,
      },
      {
        label: 'Products',
        icon: IconPackages,
        links: [
          { label: 'List', link: PATH_APPS.products.root },
          { label: 'Categories', link: PATH_APPS.products.categories },
        ],
      },
    ],
  },
  {
    title: 'Auth',
    links: [
      { label: 'Sign In', icon: IconLogin2, link: PATH_AUTH.signin },
      { label: 'Sign Up', icon: IconUserPlus, link: PATH_AUTH.signup },
      {
        label: 'Reset Password',
        icon: IconRotateRectangle,
        link: PATH_AUTH.passwordReset,
      },
      { label: 'Clerk', icon: IconUserShield, link: PATH_AUTH.clerk },
      { label: 'Auth0', icon: IconBrandAuth0, link: PATH_AUTH.auth0 },
    ],
  },
  {
    title: 'Pages',
    links: [
      { label: 'Pricing', icon: IconReceipt2, link: PATH_PAGES.pricing },
      { label: 'Blank Page', icon: IconLayersSubtract, link: PATH_PAGES.blank },
    ],
  },
  {
    title: 'Documentation',
    links: [
      {
        label: 'About',
        icon: IconExclamationCircle,
        link: PATH_ABOUT.root,
      },
      {
        label: 'Getting started',
        icon: IconLifebuoy,
        link: PATH_DOCS.root,
      },
      {
        label: 'Documentation',
        icon: IconBook2,
        link: PATH_DOCS.root,
      },
      { label: 'Changelog', icon: IconList },
    ],
  },
];
