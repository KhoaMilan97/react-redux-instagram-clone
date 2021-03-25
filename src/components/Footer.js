import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  footerContainer: {
    marginBottom: 52,
    marginTop: 52,
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  footer: {
    textAlign: "center",
    justifyContent: "center",

    "& a": {
      margin: "0 8px 12px 8px",
      fontSize: "14px",
      color: "#8e8e8e",
      "&:hover": {
        cursor: "pointer",
        textDecoration: "none",
      },
    },
  },
  paragraph: {
    fontSize: "14px",
    color: "#8e8e8e",
    "&:hover": {
      textDecoration: "none",
    },
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <Container className={classes.footerContainer}>
      <Grid container className={classes.footer}>
        <Link>About</Link>
        <Link>Blog</Link>
        <Link>Jobs</Link>
        <Link>Help</Link>
        <Link>API</Link>
        <Link>Privacy</Link>
        <Link>Terms</Link>
        <Link>Top Accounts</Link>
        <Link>Hashtags</Link>
        <Link>Location</Link>
      </Grid>
      <Grid container justify="center">
        <Link className={classes.paragraph}>
          © 2021 Instagram Clone from Khoa Milan
        </Link>
      </Grid>
    </Container>
  );
};

export default Footer;
