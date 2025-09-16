import { useRoutes } from "react-router-dom";
import { PATH } from "./path";

import Register from "../pages/auth/register";

import Home from "../pages/home";

import CreateProject from "../pages/create-project";
import HomeLayout from "../components/layout/home-layout";
import UpdateProject from "../pages/update-project";
import ProjectDetail from "../pages/project-detail";
import PrivateRoute from "../components/PrivateRoute";
import UserLayout from "../components/layout/user-layout";
import Login from "../pages/auth/login";

const useRouterElements = () => {
  const elements = useRoutes([
    {
      path: "/",
      element: (
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      ),
    },
    {
      path: PATH.LOGIN,
      element: (
        <UserLayout>
          <Login />
        </UserLayout>
      ),
    },
    {
      path: PATH.REGISTER,
      element: <Register />,
    },
    {
      path: PATH.CREATE_PROJECT,
      element: (
        <HomeLayout>
          <CreateProject />
        </HomeLayout>
      ),
    },

    {
      path: `${PATH.UPDATE_PROJECT}/:id`,
      element: (
        <HomeLayout>
          <UpdateProject />
        </HomeLayout>
      ),
    },
    {
      path: `${PATH.PROJECT_DETAIL}/:id`,
      element: (
        <HomeLayout>
          <ProjectDetail />
        </HomeLayout>
      ),
    },

    { path: PATH.NOT_FOUND, element: <div>404 Not Found</div> },
  ]);
  return elements;
};

export default useRouterElements;
