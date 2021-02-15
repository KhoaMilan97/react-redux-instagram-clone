import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Button,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  FormControl,
  Radio,
  FormControlLabel,
  RadioGroup,
} from "@material-ui/core";

import Message from "../utils/Message";
import UploadAvatar from "../components/form/UploadAvatar";
import AvatarModal from "../components/AvatarModal";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "20px 40px",
    height: "auto",
  },
  left: {
    marginLeft: "auto",
    textAlign: "right",
    marginRight: "40px",
    marginTop: 0,
  },

  link: {
    color: "#0095f6",
    marginTop: "20px",
    fontWeight: "600",
    display: "block",
  },
  circularProgress: {
    marginLeft: "auto",
    textAlign: "right",
    marginRight: "40px",
    marginTop: 0,
    display: "block",
  },
}));

function EditProfile() {
  const classes = useStyles();
  const { user, loading } = useSelector((state) => state.user);
  const { control, handleSubmit, errors, getValues, reset } = useForm();
  const [imageLoading, setImageLoading] = useState(false);

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Message />
        <Grid container justify="space-around" spacing={4}>
          <Grid item container alignItems="center">
            <Grid item xs={4}>
              {imageLoading ? (
                <CircularProgress className={classes.circularProgress} />
              ) : (
                <Avatar src={user?.avatar.url} className={classes.left} />
              )}
            </Grid>
            <Grid item xs={8}>
              <Typography>khoamilan1233</Typography>
              {user.avatar.url ? (
                <AvatarModal setImageLoading={setImageLoading} />
              ) : (
                <UploadAvatar setImageLoading={setImageLoading} />
              )}
            </Grid>
          </Grid>
          <Grid item container alignItems="center">
            <Grid item xs={4}>
              <Typography className={classes.left}>Name</Typography>
            </Grid>
            <Grid item xs={8}>
              <Controller
                as={TextField}
                defaultValue=""
                name="name"
                fullWidth
                label="Name"
                variant="outlined"
                size="small"
                helperText="Help people discover your account by using the name you're known by: either your full name, nickname, or business name."
                control={control}
              />
            </Grid>
          </Grid>

          <Grid item container alignItems="center">
            <Grid item xs={4}>
              <Typography className={classes.left}>Username</Typography>
            </Grid>
            <Grid item xs={8}>
              <Controller
                as={TextField}
                defaultValue=""
                name="username"
                fullWidth
                label="Username"
                variant="outlined"
                size="small"
                control={control}
              />
            </Grid>
          </Grid>
          <Grid item container alignItems="center">
            <Grid item xs={4}>
              <Typography className={classes.left}>Website</Typography>
            </Grid>
            <Grid item xs={8}>
              <Controller
                as={TextField}
                defaultValue=""
                name="website"
                fullWidth
                label="Website"
                variant="outlined"
                size="small"
                control={control}
              />
            </Grid>
          </Grid>

          <Grid item container alignItems="center">
            <Grid item xs={4}>
              <Typography className={classes.left}>Email</Typography>
            </Grid>
            <Grid item xs={8}>
              <Controller
                as={TextField}
                defaultValue=""
                name="email"
                fullWidth
                label="Email"
                variant="outlined"
                size="small"
                control={control}
                disabled
              />
            </Grid>
          </Grid>

          <Grid item container alignItems="center">
            <Grid item xs={4}>
              <Typography className={classes.left}>Phone Number</Typography>
            </Grid>
            <Grid item xs={8}>
              <Controller
                as={TextField}
                defaultValue=""
                name="phone"
                fullWidth
                label="Phone Number"
                variant="outlined"
                size="small"
                control={control}
              />
            </Grid>
          </Grid>

          <Grid item container alignItems="center">
            <Grid item xs={4}>
              <Typography className={classes.left}>Gender</Typography>
            </Grid>
            <Grid item xs={8}>
              <FormControl
                style={{ marginTop: 18, marginBottom: 6 }}
                component="fieldset"
              >
                <Controller
                  name="gender"
                  control={control}
                  defaultValue="female"
                  as={
                    <RadioGroup row aria-label="gender">
                      <FormControlLabel
                        value="female"
                        control={<Radio />}
                        label="Female"
                      />
                      <FormControlLabel
                        value="male"
                        control={<Radio />}
                        label="Male"
                      />
                      <FormControlLabel
                        value="other"
                        control={<Radio />}
                        label="Other"
                      />
                    </RadioGroup>
                  }
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid item container alignItems="center">
            <Grid item xs={4} />
            <Grid item xs={8}>
              <Button
                style={{ width: "100px" }}
                variant="contained"
                color="primary"
                type="submit"
                endIcon={
                  loading ? (
                    <CircularProgress size={15} className={classes.loading} />
                  ) : (
                    ""
                  )
                }
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default EditProfile;
