import { Route, Switch, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import Peer from "peerjs";
import Hidden from "@material-ui/core/Hidden";

import Footer from "./components/Footer";
import Header from "./components/header/Header";
import InstaLoading from "./components/loading/InstaLoading";

import NotFound from "./pages/NotFound";
import Accounts from "./pages/Accounts";
import Home from "./pages/Home";
import Messages from "./pages/message/Messages";
import Explore from "./pages/Explore";
import PostDetail from "./pages/PostDetail";
import Profile from "./pages/profile/Profile";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import EditPost from "./pages/post/EditPost";
import Inbox from "./pages/message/Inbox";

import PrivateRoute from "./utils/privateRoute";
import UserRoute from "./utils/userRoute";
import Message from "./utils/Message";
import ToolBarMargin from "./utils/ToolBarMargin";

import { getAccessToken } from "./functions/auth";
import SocketClient from "./SocketClient";

import { actionTypes } from "./redux/actions/actionType";
import { checkCurrentUser } from "./redux/actions/authAction";
import { setMessage } from "./redux/actions/messageAction";
import { getNotifyAction } from "./redux/actions/notifyAction";
import ScrollToTop from "./utils/ScrollToTop";
import CallModal from "./components/message/CallModal";

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
    const socket = io();
    dispatch({
      type: actionTypes.SOCKET,
      payload: socket,
    });
    return () => socket.close();
  }, [dispatch]);

  useEffect(() => {
    if (auth.token) {
      dispatch(getNotifyAction(auth.token));
    }
  }, [auth.token, dispatch]);

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
          err.response?.data?.msg &&
            dispatch(setMessage(err.response?.data?.msg, "error"));
          setPending(false);
        }
      };
      checkAuth();
    } else {
      setPending(false);
    }
  }, [auth.isLoggedIn, dispatch]);

  useEffect(() => {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
        }
      });
    }
  }, []);

  useEffect(() => {
    const newPeer = new Peer(undefined, {
      path: "/",
      secure: true,
    });

    dispatch({ type: actionTypes.PEER, payload: newPeer });
  }, [dispatch]);

  if (pending) return <InstaLoading />;

  return (
    <>
      {!hide && <Header />}
      <Message />
      <CallModal />
      {auth.token && <SocketClient />}
      <ScrollToTop />
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
        <PrivateRoute exact path="/messages" component={Messages} />
        <PrivateRoute exact path="/messages/:id" component={Inbox} />
        <PrivateRoute exact path="/explore" component={Explore} />

        <PrivateRoute exact path="/post/edit/:id" component={EditPost} />
        <PrivateRoute exact path="/post/:id" component={PostDetail} />
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

// #21 22min edit lieks
