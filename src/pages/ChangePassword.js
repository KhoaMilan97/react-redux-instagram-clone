import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Button, Grid, TextField, Typography } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import CircularProgress from "@material-ui/core/CircularProgress";

import { checkOldPassword, resetPassword } from "../functions/auth";
import { setMessage } from "../redux/actions/messageAction";
import { actionTypes } from "../redux/actions/actionType";
import Message from "../utils/Message";

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
  loading: {
    color: "white",
  },
}));

const schema = yup.object().shape({
  password: yup.string().required().min(6),
  newpassword: yup.string().required().min(6),
  confirmNewPassword: yup
    .string()
    .required()
    .min(6)
    .oneOf([yup.ref("newpassword"), null], "New Passwords must match"),
});

function ChangePassword() {
  const classes = useStyles();
  const { auth, loading } = useSelector((state) => state);
  const [showPass, setShowPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);
  const [changePassCount, setChangePassCount] = useState(0);

  const { control, handleSubmit, errors, getValues, reset } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const values = getValues();

  const handleClickShowPassword = () => {
    setShowPass(!showPass);
  };
  const handleClickShowNewPassword = () => {
    setShowNewPass(!showNewPass);
  };
  const handleClickShowConfirmNewPassword = () => {
    setShowConfirmNewPass(!showConfirmNewPass);
  };

  const onSubmit = (data) => {
    const { password } = data;
    dispatch({
      type: actionTypes.LOADING,
      payload: true,
    });

    checkOldPassword(auth.user.email, password)
      .then((res) => {
        if (res.data.ok) {
          setChangePassCount(changePassCount + 1);
          dispatch({
            type: actionTypes.LOADING,
            payload: false,
          });
        }
      })
      .catch((err) => {
        dispatch({
          type: actionTypes.LOADING,
          payload: false,
        });
        err.response.data.msg &&
          dispatch(setMessage(err.response.data.msg, "error"));
      });
  };

  useEffect(() => {
    if (changePassCount > 0) {
      const handleReset = async () => {
        try {
          if (values.newpassword) {
            const res = await resetPassword(values.newpassword, auth.token);
            dispatch({
              type: actionTypes.LOADING,
              payload: false,
            });
            dispatch(setMessage(res.data.msg, "success"));

            setChangePassCount(0);
            reset();
          }
        } catch (err) {
          err.response.data.msg &&
            dispatch(setMessage(err.response.data.msg, "error"));
        }
      };

      handleReset();
    }
  }, [changePassCount, values.newpassword, dispatch, auth.token, reset]);

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Message />
        <Grid container justify="space-around" spacing={4}>
          <Grid item container alignItems="center">
            <Grid item xs={4}>
              {auth.user.avatar?.url ? (
                <Avatar
                  alt="profile picture"
                  src={auth.user.avatar?.url}
                  className={classes.left}
                />
              ) : (
                <Avatar alt="profile picture" className={classes.left} />
              )}
            </Grid>
            <Grid item xs={8}>
              <Typography className={classes.right}>
                {auth.user.username}
              </Typography>
            </Grid>
          </Grid>
          <Grid item container alignItems="center">
            <Grid item xs={4}>
              <Typography className={classes.left}>Old Password</Typography>
            </Grid>
            <Grid item xs={8}>
              <Controller
                as={TextField}
                defaultValue=""
                name="password"
                fullWidth
                label="Old Password"
                variant="outlined"
                size="small"
                type={showPass ? "text" : "password"}
                className={classes.right}
                error={!!errors.password}
                helperText={errors?.password?.message}
                control={control}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        style={{ padding: 0 }}
                      >
                        {showPass ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Grid item container alignItems="center">
            <Grid item xs={4}>
              <Typography className={classes.left}>New Password</Typography>
            </Grid>
            <Grid item xs={8}>
              <Controller
                as={TextField}
                defaultValue=""
                name="newpassword"
                fullWidth
                label="New Password"
                variant="outlined"
                size="small"
                type={showNewPass ? "text" : "password"}
                className={classes.right}
                error={!!errors.newPassword}
                helperText={errors?.newPassword?.message}
                control={control}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowNewPassword}
                        style={{ padding: 0 }}
                      >
                        {showNewPass ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Grid item container alignItems="center">
            <Grid item xs={4}>
              <Typography className={classes.left}>
                Confirm New Password
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Controller
                as={TextField}
                defaultValue=""
                name="confirmNewPassword"
                fullWidth
                label="Confirm New Password"
                variant="outlined"
                size="small"
                type={showConfirmNewPass ? "text" : "password"}
                className={classes.right}
                error={!!errors.confirmNewPassword}
                helperText={errors?.confirmNewPassword?.message}
                control={control}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowConfirmNewPassword}
                        style={{ padding: 0 }}
                      >
                        {showConfirmNewPass ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Grid item container alignItems="center">
            <Grid item xs={4} />
            <Grid item xs={8}>
              <Button
                style={{ width: "220px" }}
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
                Change Password
              </Button>
              <Link to="/forgot-password" className={classes.link}>
                Forgot Password?
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default ChangePassword;
