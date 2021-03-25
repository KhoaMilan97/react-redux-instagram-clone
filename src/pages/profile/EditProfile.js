import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";

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

import UploadAvatar from "../../components/form/UploadAvatar";
import AvatarModal from "../../components/modal/AvatarModal";
import { updateUser } from "../../functions/user";
import { setMessage } from "../../redux/actions/messageAction";
import { actionTypes } from "../../redux/actions/actionType";
import SimpleEditor from "../../components/SimpleEditor";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "20px 40px",
    height: "auto",
    [theme.breakpoints.down("xs")]: {
      padding: "20px 5px",
    },
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
  loading: {
    color: "white",
  },
  mobileSpacing: {
    [theme.breakpoints.down("xs")]: {
      width: "100% !important",
      margin: "0px !important",
    },
  },
}));

function EditProfile() {
  const classes = useStyles();
  const { user, token } = useSelector((state) => state.auth);
  const { control, handleSubmit } = useForm();
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    data.description = description;

    setLoading(true);
    updateUser(data, user._id, token)
      .then((res) => {
        dispatch({
          type: actionTypes.GET_USER,
          payload: res.data,
        });
        dispatch(setMessage("Update Profile Success!", "success"));
        setLoading(false);
      })
      .catch((err) => {
        err.response.data.msg &&
          dispatch(setMessage(err.response.data.msg, "error"));
        setLoading(false);
      });
  };

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          className={classes.mobileSpacing}
          justify="space-around"
          spacing={4}
        >
          <Grid item container alignItems="center">
            <Grid item xs={4}>
              {imageLoading ? (
                <CircularProgress className={classes.circularProgress} />
              ) : user.avatar?.url ? (
                <Avatar
                  alt="profile picture"
                  src={user.avatar?.url}
                  className={classes.left}
                />
              ) : (
                <Avatar alt="profile picture" className={classes.left} />
              )}
            </Grid>
            <Grid item xs={8}>
              <Typography>{user.username}</Typography>
              {user.avatar?.url ? (
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
                name="fullname"
                defaultValue={user.fullname ? user.fullname : ""}
                fullWidth
                label="Name"
                variant="outlined"
                size="small"
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
                name="username"
                fullWidth
                defaultValue={user.username ? user.username : ""}
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
                defaultValue={user.website ? user.website : ""}
                name="website"
                type="url"
                fullWidth
                label="Website"
                variant="outlined"
                size="small"
                control={control}
              />
            </Grid>
          </Grid>

          {/* <Grid item container alignItems="center">
            <Grid item xs={4}>
              <Typography className={classes.left}>Description</Typography>
            </Grid>
            <Grid item xs={8}>
              <Controller
                as={TextField}
                defaultValue={user.description ? user.description : ""}
                name="description"
                fullWidth
                label="Description"
                variant="outlined"
                size="small"
                multiline
                rows={4}
                control={control}
              />
            </Grid>
          </Grid> */}

          <Grid item container alignItems="center">
            <Grid item xs={4}>
              <Typography className={classes.left}>Description 2</Typography>
            </Grid>
            <Grid item xs={8}>
              <SimpleEditor
                data={user.description}
                setDescription={setDescription}
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
                defaultValue={user.email ? user.email : ""}
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
                defaultValue={user.phoneNumber ? user.phoneNumber : ""}
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
                  defaultValue={user.gender ? user.gender : "female"}
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
                style={{ width: "130px" }}
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
