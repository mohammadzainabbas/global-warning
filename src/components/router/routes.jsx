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

import { HOME, NOT_FOUND, TASKS } from '../../common/constants';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: HOME,
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        // { path: 'user', element: <UserPage /> },
        // { path: 'products', element: <ProductsPage /> },
        // { path: 'blog', element: <BlogPage /> },
      ],
    },
    // {
    //   path: 'login',
    //   element: <LoginPage />,
    // },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
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
