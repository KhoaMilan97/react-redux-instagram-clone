import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import CircularProgress from "@material-ui/core/CircularProgress";
import { fade, makeStyles } from "@material-ui/core/styles";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ClearIcon from "@material-ui/icons/Clear";

import { searchUser } from "../../functions/user";
import UserCard from "../card/UserCard";

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    color: "#000",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.black, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.black, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: theme.spacing(2),
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
      "&:focus": {
        width: "25ch",
      },
    },
  },
  circularProgress: {
    width: "20px !important",
    height: "20px !important",
    position: "absolute",
    right: 7,
    top: 7,
    "&:hover": {
      cursor: "pointer",
    },
  },
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: "absolute",
    borderRadius: "3px",
    top: "40px",
    maxHeight: 300,
    overflowY: "auto",
  },
}));

function Search() {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [requestCount, setRequestCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);

  const auth = useSelector((state) => state.auth);
  const searchRef = useRef();

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  useEffect(() => {
    if (search.trim()) {
      setLoading(true);
      const delay = setTimeout(() => {
        setRequestCount((count) => count + 1);
      }, 500);

      return () => clearTimeout(delay);
    } else {
      setRequestCount(0);
      setLoading(false);
      setUsers([]);
    }
  }, [search]);

  useEffect(() => {
    if (requestCount) {
      searchUser(searchRef.current, auth.token).then((res) => {
        setUsers(res.data.users);
        setLoading(false);
      });
    }
  }, [requestCount, auth.token]);

  const handleClose = () => {
    setRequestCount(0);
    setLoading(false);
    setUsers([]);
    setSearch("");
  };

  const renderListProfile = () => (
    <div className={classes.root} style={{ display: show ? "block" : "none" }}>
      <UserCard users={users} handleClose={handleClose} link={true} />
    </div>
  );

  return (
    <ClickAwayListener onClickAway={() => setShow(false)}>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search…"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ "aria-label": "search" }}
          autoComplete="off"
          onFocus={() => setShow(true)}
        />
        {loading && <CircularProgress className={classes.circularProgress} />}
        {!loading && requestCount > 0 && (
          <ClearIcon
            onClick={handleClose}
            color="primary"
            className={classes.circularProgress}
          />
        )}
        {users.length > 0 && renderListProfile()}
      </div>
    </ClickAwayListener>
  );
}

export default Search;
