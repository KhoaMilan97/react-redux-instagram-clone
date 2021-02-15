import Container from "@material-ui/core/Container";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

import HomeCard from "../components/card/HomeCard";
import { Hidden } from "@material-ui/core";

const avatarUrl =
  "https://instagram.fsgn5-7.fna.fbcdn.net/v/t51.2885-19/s150x150/140698278_791431071584814_6033925397072706607_n.jpg?_nc_ht=instagram.fsgn5-7.fna.fbcdn.net&_nc_ohc=q-gAp4wlFasAX-xMv0t&tp=1&oh=961e3840bfc10ac52c45b71d14a705a9&oe=6037D01C";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 60,
    height: 60,
  },
  avatarSmall: {
    width: 40,
    height: 40,
  },
  link: {
    width: "100%",
    textAlign: "right",
    display: "inline-block",
    fontSize: "14px",
    lineHeight: "14px",
    color: "#0095f6",
    fontWeight: "600",
    "&:hover": {
      cursor: "pointer",
      textDecoration: "none",
    },
  },
  name: {
    color: "#262626",
    fontWeight: 600,
    display: "block",
  },
}));

const Home = () => {
  const classes = useStyles();
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      <Container maxWidth="md">
        <Grid container>
          <Grid
            item
            md={8}
            xs={12}
            style={{ paddingRight: matchesSM ? 0 : 30 }}
          >
            <HomeCard />
          </Grid>
          <Hidden smDown>
            <Grid item md={4}>
              <Grid container direction="column">
                <Grid item container>
                  <Grid item md={3}>
                    <Avatar
                      className={classes.avatar}
                      src={avatarUrl}
                      alt="profile picture"
                    />
                  </Grid>
                  <Grid item container alignItems="center" md>
                    <Typography className={classes.name} variant="body2">
                      khoamilan
                    </Typography>

                    <Typography style={{ color: "#8e8e8e" }}>
                      Khoa Milan
                    </Typography>
                  </Grid>
                  <Grid item container alignItems="center" md>
                    <MuiLink className={classes.link}>Switch</MuiLink>
                  </Grid>
                </Grid>
                <Grid
                  item
                  container
                  style={{ marginTop: 20, marginBottom: 20 }}
                >
                  <Grid container justify="space-between">
                    <Typography variant="body2" style={{ color: "#8e8e8e" }}>
                      Suggestions For You
                    </Typography>
                    <Typography variant="body2">See all</Typography>
                  </Grid>
                </Grid>
                <Grid item container style={{ marginBottom: 10 }}>
                  <Grid item md={2}>
                    <Avatar
                      className={classes.avatarSmall}
                      src={avatarUrl}
                      alt="profile picture"
                    />
                  </Grid>
                  <Grid item container alignItems="center" md>
                    <Typography className={classes.name} variant="body2">
                      p_25102002
                    </Typography>
                    <Typography style={{ color: "#8e8e8e", fontSize: 12 }}>
                      Followed by chicong.l
                    </Typography>
                  </Grid>
                  <Grid item container alignItems="center" md>
                    <MuiLink className={classes.link}>Follow</MuiLink>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Hidden>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
