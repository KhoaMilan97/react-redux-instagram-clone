import { Route, Redirect, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const UserRoute = ({ ...rest }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  return (
    <>
      {!user.username ? (
        <Route {...rest} />
      ) : location.state ? (
        <Redirect to={location.state.from} />
      ) : (
        <Redirect to="/" />
      )}
    </>
  );
};

export default UserRoute;
