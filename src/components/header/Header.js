import React, { useEffect, useState, useMemo } from "react";
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
}));

const Header = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = React.useState(false);
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
      {
        link: "/notifications",
        activeIndex: 4,
        icon: () => <FavoriteBorderOutlinedIcon />,
        activeIcon: () => <FavoriteIcon />,
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
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
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

      {renderMenu}
      <section className={classes.toolBarMargin} />
    </div>
  );
};

export default Header;
