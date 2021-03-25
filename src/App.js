import { Route, Switch, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Hidden from "@material-ui/core/Hidden";

import Footer from "./components/Footer";
import Header from "./components/header/Header";
import InstaLoading from "./components/loading/InstaLoading";

import NotFound from "./pages/NotFound";
import Accounts from "./pages/Accounts";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import Explore from "./pages/Explore";
import Notifications from "./pages/Notifications";
import PostDetail from "./pages/PostDetail";
import Profile from "./pages/profile/Profile";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import PrivateRoute from "./utils/privateRoute";
import UserRoute from "./utils/userRoute";
import { getAccessToken } from "./functions/auth";
import { checkCurrentUser } from "./redux/actions/authAction";
import { setMessage } from "./redux/actions/messageAction";
import EditPost from "./pages/post/EditPost";
import Message from "./utils/Message";
import ToolBarMargin from "./utils/ToolBarMargin";

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
          err.response.data.msg &&
            dispatch(setMessage(err.response.data.msg, "error"));
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
      <Message />
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
        <PrivateRoute path="/messages" component={Messages} />
        <PrivateRoute path="/explore" component={Explore} />
        <PrivateRoute path="/notifications" component={Notifications} />
        <PrivateRoute path="/post/edit/:id" component={EditPost} />
        <PrivateRoute path="/post/:id" component={PostDetail} />
        <PrivateRoute path="/:username" component={Profile} />
        <PrivateRoute sensitive exact path="/" component={Home} />

        <Route component={NotFound} />
      </Switch>
      <Hidden smUp>
        <ToolBarMargin />
      </Hidden>
      <Footer />
    </>
  );
}

export default App;
