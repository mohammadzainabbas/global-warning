import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from '../../layouts/dashboard';
import SimpleLayout from '../../layouts/simple';
//
import BlogPage from '../../pages/BlogPage';
import UserPage from '../../pages/UserPage';
import LoginPage from '../../pages/LoginPage';
import Page404 from '../../pages/Page404';
import ProductsPage from '../../pages/ProductsPage';
import DashboardAppPage from '../../pages/DashboardAppPage';

import Home from '../home/container';
import Tasks from '../tasks/component';

import { HOME, NOT_FOUND, TASKS, DASHBOARD } from '../../common/constants';
import { AppTasks } from '../../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function Router() {

  const DEFAULT_ROUTE = `${HOME}/${DASHBOARD}}`;

  const routes = useRoutes([
    {
      path: HOME,
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to={`${HOME_DASHBOARD}`} />, index: true },
        { path: 'dashboard', element: <Home /> },
        { path: 'tasks', element: <Tasks /> },
        // { path: 'products', element: <ProductsPage /> },
        // { path: 'blog', element: <BlogPage /> },
      ],
    },
    // {
    //   path: TASKS,
    //   element: <Tasks />,
    // },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to={`${HOME_DASHBOARD}`} />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to={`${NOT_FOUND}`} /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to={`${NOT_FOUND}`} replace />,
    },
  ]);

  return routes;
}
