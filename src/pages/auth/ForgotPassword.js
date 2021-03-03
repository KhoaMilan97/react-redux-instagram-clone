import React from "react";
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

import { forgotPasswordAction } from "../../redux/actions/authAction";

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
  email: yup
    .string()
    .matches(/^(?:\d{10}|\w+@\w+\.\w{2,3})$/, "You need provide email")
    .required(),
});

const ForgotPassword = () => {
  const classes = useStyles();
  const { control, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading);

  const onSubmit = (data) => {
    dispatch(forgotPasswordAction(data));
  };

  return (
    <>
      <Container maxWidth="xs" className={classes.wrapper}>
        <div>
          <Typography component="h1" variant="h4" className={classes.title}>
            Instagram
          </Typography>
          <Typography component="h2" variant="h6" className={classes.subTitle}>
            Enter your email, phone, or username and we'll send you a link to
            get back into your account.
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
          <Link to="/signin">Back To Login</Link>
        </Typography>
      </Container>
    </>
  );
};

export default ForgotPassword;
