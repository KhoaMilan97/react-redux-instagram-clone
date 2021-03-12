import { Route, Redirect, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ ...rest }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  return (
    <>
      {user.username ? (
        <Route {...rest} />
      ) : (
        <Redirect
          to={{ pathname: "/signin", state: { from: location.pathname } }}
        />
      )}
    </>
  );
};

export default PrivateRoute;
