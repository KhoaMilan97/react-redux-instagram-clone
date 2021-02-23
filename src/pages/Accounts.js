import React from "react";
import { Link, Switch, useRouteMatch } from "react-router-dom";

import { Container } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import PrivateRoute from "../utils/privateRoute";
import EditProfile from "./profile/EditProfile";
import ChangePassword from "./auth/ChangePassword";

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    color: "#262626",
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    textAlign: "left",
    "&:focus": {
      opacity: 1,
    },
    "& .MuiTab-wrapper": {
      alignItems: "flex-start",
    },
  },
}))((props) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    minHeight: 224,
    border: "1px solid #dbdbdb",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    overflow: "visible",
  },
}));

export default function Accounts() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  let { path, url } = useRouteMatch();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="md">
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          <StyledTab
            component={Link}
            to={`${url}/edit`}
            label="Edit Profile"
            {...a11yProps(0)}
          />
          <StyledTab
            component={Link}
            to={`${url}/change-password`}
            label="Change Password"
            {...a11yProps(1)}
          />
        </Tabs>
        <Switch>
          <PrivateRoute
            sensitive
            exact
            path={`${path}/edit`}
            component={EditProfile}
          />

          <PrivateRoute
            sensitive
            exact
            path={`${path}/change-password`}
            component={ChangePassword}
          />
        </Switch>
      </div>
    </Container>
  );
}
