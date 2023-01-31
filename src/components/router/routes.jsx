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
import Map from '../map/container';
import Emissions from '../emissions/container';
import Tasks from '../tasks/component';

import { HOME, NOT_FOUND, TASKS, DASHBOARD, MAP, EMISSIONS, DISASTERS } from '../../common/constants';

// ----------------------------------------------------------------------

export default function Router() {

  const DEFAULT_ROUTE = `${HOME}/${DASHBOARD}`;

  const routes = useRoutes([
    {
      path: HOME,
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to={`${DEFAULT_ROUTE}`} />, index: true },
        { path: DASHBOARD, element: <Home /> },
        { path: TASKS, element: <Tasks /> },
        { path: MAP, element: <Map /> },
        { path: DISASTERS, element: <Disasters /> },
        { path: EMISSIONS, element: <Emissions /> },
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
        { element: <Navigate to={`${DEFAULT_ROUTE}`} />, index: true },
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
