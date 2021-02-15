import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const UserRoute = ({ ...rest }) => {
  const { user } = useSelector((state) => state.user);
  return <>{!user.username ? <Route {...rest} /> : <Redirect to="/" />}</>;
};

export default UserRoute;
