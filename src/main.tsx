import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from '@/layout'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import BookPage from '@/pages/client/book';
import AboutPage from '@/pages/client/about';
import ErrorPage from '@/pages/error/error.page';
import LoginPage from '@/pages/client/auth/login';
import RegisterPage from '@/pages/client/auth/register';
import 'styles/global.scss'
import HomePage from '@/pages/client/home';
import { App } from 'antd';
import { AppProvider } from 'components/context/app.context';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/book",
        element: <BookPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },

    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </App>
  </StrictMode>,
)
