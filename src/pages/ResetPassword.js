import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { resetPasswordAction } from "../redux/actions/authAction";
import Message from "../utils/Message";

import bgTitle from "../assets/img/32f0a4f27407.png";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: 40,
    textAlign: "center",
    backgroundColor: "white",
    maxWidth: 350,
    border: "1px solid #dbdbdb",
    marginTop: 30,
    boxSizing: "border-box",
  },
  wrapper2: {
    marginTop: 0,
    borderTop: "0px",
    textAlign: "center",
    backgroundColor: "white",
    maxWidth: 350,
    border: "1px solid #dbdbdb",
    padding: 15,
    boxSizing: "border-box",
    marginBottom: 44,
  },
  formControl: {
    marginBottom: 20,
  },
  title: {
    margin: "0 auto 12px",
    textIndent: "110%",
    overflow: "hidden",
    backgroundImage: `url(${bgTitle})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "0 -130px",
    height: 51,
    width: 175,
  },
  subTitle: {
    color: "#8e8e8e",
    fontSize: 14,
    fontWeight: 300,
    marginBottom: 10,
  },
  link: {
    color: "#262626",
    "& a": {
      color: "#0095f6",
      textDecoration: "none",
    },
  },
  forgot: {
    color: "#00376b",
    fontSize: 12,
    lineHeight: "14px",
    marginTop: "20px",
    textAlign: "center",
    textDecoration: "none",
    display: "block",
  },
  loading: {
    color: "white",
  },
}));

const schema = yup.object().shape({
  password: yup.string().required().min(6),
  confirmPassword: yup
    .string()
    .required()
    .min(6)
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const ResetPassword = () => {
  const classes = useStyles();
  const { control, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const { token } = useParams();

  const onSubmit = (data) => {
    const { password } = data;
    dispatch(resetPasswordAction(password, token));
  };

  const handleClickShowPassword = () => {
    setShowPass(!showPass);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPass(!showConfirmPass);
  };

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Container maxWidth="xs" className={classes.wrapper}>
        <div>
          <Typography component="h1" variant="h4" className={classes.title}>
            Instagram
          </Typography>
          <Typography component="h2" variant="h6" className={classes.subTitle}>
            Reset your password!
          </Typography>
          <Message />
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              as={TextField}
              defaultValue=""
              name="password"
              fullWidth
              label="New Password"
              variant="outlined"
              size="small"
              type={showPass ? "text" : "password"}
              className={classes.formControl}
              error={!!errors.password}
              helperText={errors?.password?.message}
              control={control}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      style={{ padding: 0 }}
                    >
                      {showPass ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Controller
              as={TextField}
              defaultValue=""
              name="confirmPassword"
              fullWidth
              label="Confirm New Password"
              variant="outlined"
              size="small"
              type={showConfirmPass ? "text" : "password"}
              className={classes.formControl}
              error={!!errors.confirmPassword}
              helperText={errors?.confirmPassword?.message}
              control={control}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownConfirmPassword}
                      style={{ padding: 0 }}
                    >
                      {showConfirmPass ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              endIcon={
                loading ? (
                  <CircularProgress size={15} className={classes.loading} />
                ) : (
                  ""
                )
              }
            >
              Send
            </Button>
          </form>
        </div>
      </Container>
      <Container className={classes.wrapper2}>
        <Typography
          component="p"
          className={classes.link}
          style={{ fontSize: "14px" }}
        >
          <Link to="/signin">Skip</Link>
        </Typography>
      </Container>
    </>
  );
};

export default ResetPassword;
