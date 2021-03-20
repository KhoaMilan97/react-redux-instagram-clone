import React, { useState } from "react";
import { Link } from "react-router-dom";
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

import { loginUserAction } from "../../redux/actions/authAction";

import bgTitle from "../../assets/img/32f0a4f27407.png";

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
    marginTop: 20,
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
  email: yup
    .string()
    .matches(/^(?:\d{10}|\w+@\w+\.\w{2,3})$/, "You need provide email")
    .required(),
  password: yup.string().required().min(8),
});

const SignIn = () => {
  const classes = useStyles();
  const { control, handleSubmit, errors, formState } = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const { isDirty, isValid } = formState;

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading);
  const [showPass, setShowPass] = useState(false);

  const onSubmit = (data) => {
    dispatch(loginUserAction(data));
  };

  const handleClickShowPassword = () => {
    setShowPass(!showPass);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Container maxWidth="xs" className={classes.wrapper}>
        <div>
          <Typography component="h1" variant="h4" className={classes.title}>
            Instagram
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              as={TextField}
              defaultValue=""
              name="email"
              fullWidth
              label="Email"
              variant="outlined"
              size="small"
              className={classes.formControl}
              error={!!errors.email}
              helperText={errors?.email?.message}
              control={control}
            />

            <Controller
              as={TextField}
              defaultValue=""
              name="password"
              control={control}
              className={classes.formControl}
              error={!!errors.password}
              helperText={errors?.password?.message}
              fullWidth
              type={showPass ? "text" : "password"}
              label="Password"
              variant="outlined"
              size="small"
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={!isDirty || !isValid}
              endIcon={
                loading ? (
                  <CircularProgress size={15} className={classes.loading} />
                ) : (
                  ""
                )
              }
            >
              Log In
            </Button>
            <Link to="forgot-password" className={classes.forgot}>
              Forgot password?
            </Link>
          </form>
        </div>
      </Container>
      <Container className={classes.wrapper2}>
        <Typography
          component="p"
          className={classes.link}
          style={{ fontSize: "14px" }}
        >
          Don't have an account? <Link to="/signup">Sign up</Link>
        </Typography>
      </Container>
    </>
  );
};

export default SignIn;
