import React, { useEffect, useState, useMemo, Fragment } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

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

import { logout } from "../../functions/auth";
import { logOutUser } from "../../redux/actions/authAction";

import bgNav from "../../assets/img/bg-nav.png";
import Search from "./Search";
import moment from "moment";

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
}));

const Header = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { user } = useSelector((state) => state.auth);
  const notify = useSelector((state) => state.notify);
  const [open, setOpen] = React.useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const anchorRef = React.useRef(null);
  const location = useLocation();
  const [active, setActive] = useState(0);

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

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    setActive(5);
    setOpenNotification(false);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const handleCloseNotify = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpenNotification(false);
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
    <Popper
      open={openNotification}
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
            <ClickAwayListener onClickAway={handleCloseNotify}>
              <List
                id="menu-list-grow-1"
                onKeyDown={handleListKeyDown}
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  minWidth: "100px",
                }}
              >
                {notify.length > 0 &&
                  notify.map((n) => (
                    <Fragment key={n._id}>
                      <ListItem
                        key={n._id}
                        alignItems="flex-start"
                        onClick={handleCloseNotify}
                        component={Link}
                        to={n.url}
                      >
                        <ListItemAvatar>
                          <Avatar
                            alt={n.user?.username}
                            src={n.user?.avatar?.url}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <React.Fragment>
                              <Typography component="b">
                                {n.user?.username}{" "}
                              </Typography>
                              <span style={{ color: "#262626" }}>{n.text}</span>
                            </React.Fragment>
                          }
                          secondary={n.content}
                        />
                      </ListItem>
                      <Typography
                        component="p"
                        style={{
                          paddingLeft: "1rem",
                          fontSize: "14px",
                          color: "#8e8e8e",
                          marginTop: "-10px",
                          marginBottom: "10px",
                        }}
                      >
                        {moment(n.createdAt).fromNow()}
                      </Typography>
                      {notify.length > 1 && <Divider />}
                    </Fragment>
                  ))}
                <span className={classes.deleteNotify}>Delete All</span>
              </List>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
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
              <IconButton
                edge="end"
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
                <Badge badgeContent={notify.length} color="error">
                  {notify.length > 0 ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderOutlinedIcon />
                  )}
                </Badge>
              </IconButton>

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
      {renderNotification}
      <section className={classes.toolBarMargin} />

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

            <IconButton
              edge="end"
              onClick={() => {
                setOpenNotification((prevOpen) => !prevOpen);
                setActive(4);
                setOpen(false);
              }}
              color="inherit"
              aria-controls={openNotification ? "menu-list-grow-1" : undefined}
              aria-haspopup="true"
            >
              <Badge badgeContent={notify.length} color="error">
                {notify.length > 0 ? (
                  <FavoriteIcon />
                ) : (
                  <FavoriteBorderOutlinedIcon />
                )}
              </Badge>
            </IconButton>

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
