import React, { useEffect, useState, useMemo, Fragment } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
import Hidden from "@material-ui/core/Hidden";
import Badge from "@material-ui/core/Badge";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Tooltip from "@material-ui/core/Tooltip";
import ListSubheader from "@material-ui/core/ListSubheader";

import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import AccountCircle from "@material-ui/icons/AccountCircle";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
import ExploreOutlinedIcon from "@material-ui/icons/ExploreOutlined";
import HomeSharpIcon from "@material-ui/icons/HomeSharp";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import SettingsIcon from "@material-ui/icons/Settings";
import EmailIcon from "@material-ui/icons/Email";
import ExploreIcon from "@material-ui/icons/Explore";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";

import { logout } from "../../functions/auth";
import { logOutUser } from "../../redux/actions/authAction";

import bgNav from "../../assets/img/bg-nav.png";
import Search from "./Search";

import {
  isReadNotifyAction,
  deleteAllNotifiesAction,
} from "../../redux/actions/notifyAction";
import { actionTypes } from "../../redux/actions/actionType";
import NotifyModalConfirm from "../modal/NotifyModalConfirm";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  appBar: {
    alignItems: "center",
    backgroundColor: "#fff",
  },
  toolbarContainer: {
    maxWidth: theme.breakpoints.width("md"),
    width: "100%",
  },
  toolBarMargin: {
    ...theme.mixins.toolbar,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",

    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },

  sectionDesktop: {
    display: "flex",
    color: "rgb(38, 38, 38) !important",
  },

  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  appBarBottom: {
    top: "auto",
    bottom: 0,
    alignItems: "center",
    backgroundColor: "#fff",
    display: "none",
    [theme.breakpoints.down("xs")]: {
      display: "block",
    },
  },
  deleteNotify: {
    display: "block",
    textAlign: "right",
    margin: "15px 10px 15px 0",
    color: "red",
    fontWeight: "400",
    fontSize: "14px",
    "&:hover": {
      cursor: "pointer",
    },
  },
  imageNotify: {
    width: "80px",
    height: "auto",
    marginLeft: "10px",
    borderRadius: "50%",
  },
  notification: {
    width: "500px",
    maxWidth: 600,
    backgroundColor: theme.palette.background.paper,
    boxShadow: "1px 2px 3px 0px #aba8a8",
    position: "absolute",
    border: "1px solid #eee",
    borderRadius: "3px",
    top: "50px",
    maxHeight: 500,
    overflowY: "auto",
    right: "-25px",
    [theme.breakpoints.down("xs")]: {
      bottom: "40px",
      top: "unset",
      right: "-70px",
      width: "350px",
    },
  },
}));

const Header = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { user, token } = useSelector((state) => state.auth);
  const { data: notify, sound } = useSelector((state) => state.notify);
  const [open, setOpen] = React.useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [openNotificationMobile, setOpenNotificationMobile] = useState(false);
  const anchorRef = React.useRef(null);
  const location = useLocation();
  const [active, setActive] = useState(0);
  const [notifyUnRead, setNotifyUnRead] = useState(0);
  const [openNotifyConfirm, setOpenNotifyConfirm] = useState(false);

  const routes = useMemo(
    () => [
      {
        link: "/",
        activeIndex: 1,
        icon: () => <HomeOutlinedIcon />,
        activeIcon: () => <HomeSharpIcon />,
      },
      {
        link: "/messages",
        activeIndex: 2,
        icon: () => <EmailOutlinedIcon />,
        activeIcon: () => <EmailIcon />,
      },
      {
        link: "/explore",
        activeIndex: 3,
        icon: () => <ExploreOutlinedIcon />,
        activeIcon: () => <ExploreIcon />,
      },
    ],
    []
  );

  useEffect(() => {
    routes.forEach((route) => {
      switch (location.pathname) {
        case `${route.link}`:
          setActive(route.activeIndex);
          break;

        default:
          break;
      }
    });
  }, [location, routes]);

  useEffect(() => {
    let newArr = notify.filter((item) => item.isRead === false);

    setNotifyUnRead(newArr.length);
  }, [notify]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    setActive(5);
    setOpenNotification(false);
    setOpenNotificationMobile(false);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const handleCloseNotify = () => {
    setOpenNotification(false);
  };

  const handleCloseNotifyMobile = () => {
    setOpenNotificationMobile(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleLogout = () => {
    logout().then((res) => {
      dispatch(logOutUser());
      localStorage.removeItem("firstLogin");
      history.push("/signin");
    });
  };

  const handleReadNotification = (notify) => {
    dispatch(isReadNotifyAction(notify, token));
  };

  const handleSound = () => {
    dispatch({ type: actionTypes.UPDATE_SOUND, payload: !sound });
  };

  const handleDeleteAllNotifies = () => {
    if (notifyUnRead === 0) {
      dispatch(deleteAllNotifiesAction(token));
      setOpenNotification(false);
      setOpenNotificationMobile(false);
      return;
    }

    setOpenNotifyConfirm(true);
  };

  const renderMenu = (
    <Popper
      open={open}
      anchorEl={anchorRef.current}
      role={undefined}
      transition
      disablePortal
      placement="bottom-end"
      style={{ zIndex: 1110 }}
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin:
              placement === "bottom" ? "center top" : "center bottom",
          }}
        >
          <Paper>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList
                autoFocusItem={open}
                id="menu-list-grow"
                onKeyDown={handleListKeyDown}
              >
                <MenuItem
                  onClick={handleClose}
                  component={Link}
                  to={`/${user.username}`}
                >
                  <ListItemIcon>
                    <AccountCircle />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </MenuItem>
                <MenuItem
                  component={Link}
                  to={`/${user.username}/saved`}
                  onClick={handleClose}
                >
                  <ListItemIcon>
                    <BookmarkBorderIcon />
                  </ListItemIcon>

                  <ListItemText primary="Save" />
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/accounts/edit"
                  onClick={handleClose}
                >
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>

                  <ListItemText primary="Setting" />
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );

  const renderNotification = (
    <div className={classes.notification}>
      <List
        id="menu-list-grow-1"
        subheader={
          <ListSubheader
            component="div"
            disableSticky
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            Notifications{" "}
            {sound ? (
              <Tooltip title="Turn off Notifications">
                <IconButton onClick={handleSound}>
                  <NotificationsActiveIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Turn on Notifications">
                <IconButton onClick={handleSound}>
                  <NotificationsNoneIcon />
                </IconButton>
              </Tooltip>
            )}
          </ListSubheader>
        }
        onKeyDown={handleListKeyDown}
      >
        {notify.length > 0 &&
          notify.map((n) => (
            <Fragment key={n._id}>
              <ListItem
                alignItems="center"
                onClick={() => {
                  handleCloseNotify();
                  handleCloseNotifyMobile();
                  handleReadNotification(n);
                }}
                component={Link}
                to={n.url}
              >
                <ListItemAvatar>
                  <Avatar alt={n.user?.username} src={n.user?.avatar?.url} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Typography component="b">{n.user?.username} </Typography>
                      <span style={{ color: "#262626" }}>{n.text}</span>
                    </React.Fragment>
                  }
                  secondary={
                    n.content && (
                      <Fragment>
                        <Typography component="span">
                          {n.content.slice(0, 20)}...
                        </Typography>
                      </Fragment>
                    )
                  }
                />

                {n.image && (
                  <img
                    src={n.image}
                    alt={n.content}
                    className={classes.imageNotify}
                  />
                )}
                {n.isRead === false && (
                  <FiberManualRecordIcon color="primary" />
                )}
              </ListItem>
              <Typography
                component="span"
                style={{
                  fontSize: "14px",
                  color: n.isRead ? "#8e8e8e" : "#0095f6",
                  marginTop: n.content ? "-10px" : "0px",
                  marginBottom: "10px",
                  marginLeft: "15px",
                  display: "block",
                }}
              >
                {moment(n.createdAt).fromNow()}
              </Typography>
              <Divider />
            </Fragment>
          ))}

        <span
          onClick={handleDeleteAllNotifies}
          className={classes.deleteNotify}
        >
          Delete All
        </span>
      </List>
    </div>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="fixed" className={classes.appBar} elevation={1}>
        <Toolbar className={classes.toolbarContainer}>
          <Typography
            component={Link}
            to="/"
            className={classes.title}
            variant="h6"
            noWrap
          >
            <img src={bgNav} alt="instagram" style={{ marginTop: 10 }} />
          </Typography>
          <div className={classes.grow} />
          <Search />
          <div className={classes.grow} />
          <Hidden xsDown>
            <div className={classes.sectionDesktop}>
              {routes.map((route) => (
                <IconButton
                  key={route.activeIndex}
                  component={Link}
                  to={route.link}
                  color="inherit"
                >
                  {route.activeIndex === active
                    ? route.activeIcon()
                    : route.icon()}
                </IconButton>
              ))}
              <ClickAwayListener onClickAway={handleCloseNotify}>
                <div style={{ position: "relative" }}>
                  <IconButton
                    onClick={() => {
                      setOpenNotification((prevOpen) => !prevOpen);
                      setActive(4);
                      setOpen(false);
                    }}
                    color="inherit"
                    aria-controls={
                      openNotification ? "menu-list-grow-1" : undefined
                    }
                    aria-haspopup="true"
                  >
                    <Badge badgeContent={notifyUnRead} color="error">
                      {notify.length > 0 ? (
                        <FavoriteIcon />
                      ) : (
                        <FavoriteBorderOutlinedIcon />
                      )}
                    </Badge>
                  </IconButton>
                  <Grow in={openNotification}>{renderNotification}</Grow>
                </div>
              </ClickAwayListener>

              <IconButton
                edge="end"
                aria-label="account of current user"
                ref={anchorRef}
                aria-controls={open ? "menu-list-grow" : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="inherit"
              >
                {user.avatar?.url &&
                !(
                  Object.keys(user.avatar?.url).length === 0 &&
                  user.avatar?.url.constructor === Object
                ) ? (
                  <Avatar
                    alt={user.username}
                    src={user.avatar?.url}
                    className={classes.avatar}
                  />
                ) : (
                  <Avatar alt="avatar" className={classes.avatar} />
                )}
              </IconButton>
            </div>
          </Hidden>
        </Toolbar>
      </AppBar>

      {renderMenu}

      <section className={classes.toolBarMargin} />
      <NotifyModalConfirm
        open={openNotifyConfirm}
        setOpen={setOpenNotifyConfirm}
        dispatch={dispatch}
        notifyUnRead={notifyUnRead}
      />

      <AppBar position="fixed" className={classes.appBarBottom} elevation={1}>
        <Toolbar className={classes.toolbarContainer}>
          <div
            className={classes.sectionDesktop}
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-around",
            }}
          >
            {routes.map((route) => (
              <IconButton
                key={route.activeIndex}
                component={Link}
                to={route.link}
                color="inherit"
              >
                {route.activeIndex === active
                  ? route.activeIcon()
                  : route.icon()}
              </IconButton>
            ))}
            <ClickAwayListener onClickAway={handleCloseNotifyMobile}>
              <div style={{ position: "relative" }}>
                <IconButton
                  onClick={() => {
                    setOpenNotificationMobile((prevOpen) => !prevOpen);
                    setActive(4);
                    setOpen(false);
                  }}
                  color="inherit"
                >
                  <Badge badgeContent={notify.length} color="error">
                    {notify.length > 0 ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderOutlinedIcon />
                    )}
                  </Badge>
                </IconButton>
                <Grow in={openNotificationMobile}>{renderNotification}</Grow>
              </div>
            </ClickAwayListener>

            <IconButton
              edge="end"
              aria-label="account of current user"
              ref={anchorRef}
              aria-controls={open ? "menu-list-grow" : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              color="inherit"
            >
              {user.avatar?.url &&
              !(
                Object.keys(user.avatar?.url).length === 0 &&
                user.avatar?.url.constructor === Object
              ) ? (
                <Avatar
                  alt={user.username}
                  src={user.avatar?.url}
                  className={classes.avatar}
                />
              ) : (
                <Avatar alt="avatar" className={classes.avatar} />
              )}
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
