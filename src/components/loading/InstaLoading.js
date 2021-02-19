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
  icon: {
    width: 70,
    height: 70,
    color: "#ccc",
  },
}));

const InstaLoading = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className="main">
        <InstagramIcon className={classes.icon} />
      </div>
    </div>
  );
};

export default InstaLoading;
