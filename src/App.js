import { Route, Switch, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import SignUp from "./pages/SignUp";
import Footer from "./components/Footer";
import SignIn from "./pages/SignIn";
import Header from "./components/header/Header";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import PrivateRoute from "./utils/privateRoute";
import UserRoute from "./utils/userRoute";

import { getAccessToken } from "./functions/auth";
import { checkCurrentUser } from "./redux/actions/authAction";
import NotFound from "./pages/NotFound";
import Accounts from "./pages/Accounts";
import InstaLoading from "./components/loading/InstaLoading";

function App() {
  const { pathname } = useLocation();

  let hide =
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname.includes("/reset-password/");

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      const checkAuth = async () => {
        try {
          const res = await getAccessToken();
          dispatch(checkCurrentUser(res.data));
          setPending(false);
        } catch (err) {
          console.log(err);
          setPending(false);
        }
      };
      checkAuth();
    } else {
      setPending(false);
    }
  }, [auth.isLoggedIn, dispatch]);

  if (pending) return <InstaLoading />;

  return (
    <>
      {!hide && <Header />}
      <Switch>
        <UserRoute sensitive exact path="/signup" component={SignUp} />
        <UserRoute sensitive exact path="/signin" component={SignIn} />
        <Route
          sensitive
          exact
          path="/forgot-password"
          component={ForgotPassword}
        />
        <UserRoute
          sensitive
          exact
          path="/reset-password/:token"
          component={ResetPassword}
        />
        <PrivateRoute path="/accounts" component={Accounts} />

        <PrivateRoute sensitive exact path="/:username" component={Profile} />
        <PrivateRoute sensitive exact path="/" component={Home} />

        <Route component={NotFound} />
      </Switch>
      <Footer />
    </>
  );
}

export default App;
