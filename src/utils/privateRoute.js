import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ ...rest }) => {
  const { user } = useSelector((state) => state.auth);
  return <>{user.username ? <Route {...rest} /> : <Redirect to="/signin" />}</>;
};

export default PrivateRoute;
