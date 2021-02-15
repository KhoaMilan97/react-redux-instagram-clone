import { Route, Switch, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import SignUp from "./pages/SignUp";
import Footer from "./components/ui/Footer";
import SignIn from "./pages/SignIn";
import Header from "./components/ui/Header";
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

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function App() {
  const { pathname } = useLocation();

  let hide =
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname.includes("/reset-password/");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [pending, setPending] = useState(true);
  const classes = useStyles();

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
  }, [user.isLoggedIn, dispatch]);

  if (pending)
    return (
      <Backdrop className={classes.backdrop} open={pending}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );

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
