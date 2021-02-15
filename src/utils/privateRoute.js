import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ ...rest }) => {
  const { user } = useSelector((state) => state.user);
  return <>{user.username ? <Route {...rest} /> : <Redirect to="/signin" />}</>;
};

export default PrivateRoute;
