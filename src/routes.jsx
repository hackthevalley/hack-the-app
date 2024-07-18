import { lazy } from 'react';
import { CgHome } from 'react-icons/cg';

import DashboardLayout from './components/DashboardLayout';
import HackerInfo from './pages/HackerInfo';
import Login from './pages/Login';

export const dashboardLinks = [
  {
    to: '/',
    label: 'Home',
    icon: CgHome,
    exact: true,
  },
];

const dashboardComponent = (LazyComponent) => () =>
  (
    <DashboardLayout routes={dashboardLinks} withAuth>
      <LazyComponent />
    </DashboardLayout>
  );

export default [
  {
    path: '/login',
    component: Login,
    exact: true,
  },
  {
    path: '/',
    component: dashboardComponent(lazy(() => import('./pages/Scanner'))),
    exact: true,
  },
  {
    path: '/hackerinfo',
    component: HackerInfo,
    exact: true,
  },
];
