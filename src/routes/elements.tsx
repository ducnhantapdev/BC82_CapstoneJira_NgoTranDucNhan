import { useRoutes } from "react-router-dom";
import { PATH } from "./path";

import Login from "../components/formLogin";

import Home from "../pages/home";
import PrivateRoute from "../components/privateRoute";
import CreateProject from "../pages/create-project";
import HomeLayout from "../components/layout/home-layout";
import UpdateProject from "../pages/update-project";
import ProjectDetail from "../pages/project-detail";

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
      element: <Login />,
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
