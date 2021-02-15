import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useDispatch, useSelector } from "react-redux";
import Slide from "@material-ui/core/Slide";

import { clearMessage } from "../redux/actions/messageAction";

// function Alert(props) {
//   return (
//     <MuiAlert elevation={6} variant="filled" {...props}>
//       {props.children}
//     </MuiAlert>
//   );
// }

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} variant="filled" {...props} ref={ref} />
));

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

function Message({ severity }) {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.message);

  const { open, vertical, horizontal, msg, type } = message;
  const handeClose = () => {
    dispatch(clearMessage());
  };
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={6000}
        onClose={handeClose}
        TransitionComponent={SlideTransition}
        key={vertical + horizontal}
      >
        <Alert onClose={handeClose} severity={type}>
          {msg}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Message;
