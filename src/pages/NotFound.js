import { Link } from "react-router-dom";

import { Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    height: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    height: 100,
  },
  link: {
    textAlign: "center",
    display: "block",
    width: "100%",
    textDecoration: "none",
    color: "#00376b",
    marginTop: "20px",
  },
}));

const NotFound = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="sm" className={classes.container}>
      <section className={classes.main}>
        <Typography component="h1" variant="h4">
          Sorry, this page isn't available.
        </Typography>
        <Link to="/" className={classes.link}>
          Back to home page
        </Link>
      </section>
    </Container>
  );
};

export default NotFound;
