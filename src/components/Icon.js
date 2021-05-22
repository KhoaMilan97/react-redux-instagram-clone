import React from "react";
import { reactions } from "../utils/ListIcon";

import { makeStyles } from "@material-ui/core/styles";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Menu from "@material-ui/core/Menu";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "250px",
    height: "auto",
    maxHeight: "300px",
    overflowY: "auto",
    backgroundColor: "white",
  },
  icon: {
    fontSize: "20px",
    padding: "5px",
    cursor: "pointer",
    display: "inline-block",
  },
}));

function Icon({ title, setTitle }) {
  const classes = useStyles();
  //const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.iconContainer}>
      <Tooltip title="Emoji">
        <IconButton
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
          style={{ padding: "0px 10px 2px 0px" }}
        >
          <InsertEmoticonIcon />
        </IconButton>
      </Tooltip>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        // anchorOrigin={{
        //   vertical: "bottom",
        //   horizontal: "left",
        // }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <div className={classes.root}>
          {reactions.map((icon) => (
            <span
              onClick={() => setTitle(title + icon)}
              className={classes.icon}
              key={icon}
            >
              {icon}
            </span>
          ))}
        </div>
      </Menu>
    </div>
  );
}

export default Icon;
