import { useRoutes } from "react-router-dom";
import { PATH } from "./path";

import Login from "../components/form-login";

import Home from "../pages/home";
import PrivateRoute from "../components/PrivateRoute";

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

    { path: PATH.NOT_FOUND, element: <div>404 Not Found</div> },
  ]);
  return elements;
};

export default useRouterElements;
