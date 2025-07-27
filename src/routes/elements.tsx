import { useRoutes } from "react-router-dom";
import { PATH } from "./path";

import Login from "../components/form-login";

import Home from "../pages/home";
import PrivateRoute from "../components/PrivateRoute";
import CreateProject from "../pages/create-project";
import HomeLayout from "../components/layout/home-layout";

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

    { path: PATH.NOT_FOUND, element: <div>404 Not Found</div> },
  ]);
  return elements;
};

export default useRouterElements;
