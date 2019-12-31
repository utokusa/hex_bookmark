import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  input: {
    display: 'none',
  },
  button: {
    margin: theme.spacing(0.5),
  },
}));

export default function Bookmark(props) {
  const classes = useStyles();

  return (
    <div>
      <input
        className={classes.input}
        accept={props.accept}
        id={props.strId}
        type="file"
        ref={props.fin}
        onChange={props.onChange}
      />
      <label htmlFor={props.strId}>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          size="small"
          component="span"
        >
          {props.label}
        </Button>
      </label>
    </div>
  );
}