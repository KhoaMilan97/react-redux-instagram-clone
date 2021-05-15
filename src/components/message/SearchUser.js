import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";

import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { searchUser } from "../../functions/user";
import UserCard from "../card/UserCard";
import {
  addUserAction,
  getConservationAction,
} from "../../redux/actions/chatAction";

const useStyles = makeStyles((theme) => ({
  topLeftSide: {
    borderBottom: "1px solid #dbdbdb",
    width: "100%",
    padding: "0 20px",
  },
  input: {
    marginTop: "10px",
    marginBottom: "10px",
  },
}));

function SearchUser() {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [requestCount, setRequestCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const { auth, chat } = useSelector((state) => state);
  const dispatch = useDispatch();
  const searchRef = useRef();
  const history = useHistory();
  const { id } = useParams();
  const theme = useTheme();
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

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

  const handleAddUser = (user) => {
    setSearch("");
    setUsers([]);
    dispatch(addUserAction(user, chat));
    return history.push(`/messages/${user._id}`);
  };

  const isActive = (user) => {
    if (id === user._id) return true;
    return false;
  };

  useEffect(() => {
    if (chat.firstLoad) return;
    dispatch(getConservationAction(auth));
  }, [dispatch, auth, chat.firstLoad]);

  return (
    <Grid container direction="column">
      <Grid item className={classes.topLeftSide}>
        <FormControl fullWidth className={classes.input}>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disableUnderline
            placeholder="Search Users"
          />
        </FormControl>
      </Grid>
      <Grid item>
        {users.length > 0 && (
          <UserCard
            matchesXS={matchesXS}
            users={users}
            handleAddUser={handleAddUser}
          />
        )}
        {chat.users.length > 0 && (
          <UserCard
            matchesXS={matchesXS}
            users={chat.users}
            isActive={isActive}
            handleAddUser={handleAddUser}
          />
        )}
      </Grid>
    </Grid>
  );
}

export default SearchUser;
