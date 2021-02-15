import InstagramIcon from "@material-ui/icons/Instagram";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
}));

const Loading = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className="main">
        <InstagramIcon />
      </div>
    </div>
  );
};

export default Loading;
