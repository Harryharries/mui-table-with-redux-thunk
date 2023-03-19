import React, { useState, SyntheticEvent } from "react";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Slide, { SlideProps } from "@mui/material/Slide";
import Alert, { AlertProps } from "@mui/material/Alert";

interface WithSnackbarProps {
  snackbarShowMessage: (message: string, severity?: AlertProps['severity'], duration?: number) => void;
}

export const withSnackbar = <P extends WithSnackbarProps>(
  WrappedComponent: React.ComponentType<P>
): React.FC<Omit<P, keyof WithSnackbarProps>> => {
  return (props: Omit<P, keyof WithSnackbarProps>) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("I'm a custom snackbar");
    const [duration, setDuration] = useState(5000);
    const [severity, setSeverity] = useState<AlertProps['severity']>("success");

    const showMessage = (
      message: string,
      severity: AlertProps['severity'] = "success",
      duration: number = 5000
    ) => {
      setMessage(message);
      setSeverity(severity);
      setDuration(duration);
      setOpen(true);
    };

    const handleClose = (
      event: SyntheticEvent | Event,
      reason?: SnackbarCloseReason
    ) => {
      if (reason === "clickaway") {
        return;
      }
      setOpen(false);
    };

    const wrappedComponentProps = {
      ...props,
      snackbarShowMessage: showMessage,
    } as P;

    return (
      <>
        <WrappedComponent {...wrappedComponentProps} />
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          autoHideDuration={duration}
          open={open}
          onClose={handleClose}
          TransitionComponent={Slide as React.ComponentType<SlideProps>}
        >
          <Alert variant="filled" onClose={handleClose} severity={severity}>
            {message}
          </Alert>
        </Snackbar>
      </>
    );
  };
};
