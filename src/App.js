import React from 'react';
// import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function App(props) {
  const classes = useStyles(props);
  return (
    <div className={classes.app}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="title" color="inherit">
            Hex Bookmark
            </Typography>
        </Toolbar>
      </AppBar>
      <InputBinaryFile />
      <Bookmark />
    </div>
  );
}

// const styles = {
//   app: {
//     textAlign: 'center'
//   },
//   input: {
//     display: 'none',
//   },
//   root: {
//     width: '100%',
//     overflowX: 'auto',
//   },
//   table: {
//     minWidth: 650,
//   },
//   button: {
//     margin: theme.spacing(1),
//   },
// };

const useStyles = makeStyles(theme => ({
  app: {
    textAlign: 'center'
  },
  input: {
    display: 'none',
  },
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  button: {
    margin: theme.spacing(1),
  },
}));

class Bookmark extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box
        boxShadow={3}
        bgcolor="background.paper"
        m={6}
        p={1}
        style={{ width: '60rem', height: '30rem' }}
      >
        <BookmarkControl />
        <BookmarkTable />
      </Box>
    );
  }
}

function BookmarkControl() {
  const classes = useStyles();
  return (
    <div>
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
      <Fab color="secondary" aria-label="edit">
        <EditIcon />
      </Fab>
      <Button
        variant="contained"
        color="primary"
        size="large"
        className={classes.button}
        startIcon={<SaveIcon />}
      >
        Save Bookmark
      </Button>
      <Button
        variant="contained"
        color="secondary"
        size="large"
        className={classes.button}
        startIcon={<SaveIcon />}
      >
        Load Bookmark
      </Button>
    </div>
  );
}

class BookmarkTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <SimpleTable />
      </div>
    );
  }
}

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

function SimpleTable() {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

class InputBinaryFile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box
        boxShadow={3}
        bgcolor="background.paper"
        m={6}
        p={1}
        style={{ width: '40rem', height: '5rem' }}
      >
        <UploadButtons />
        <label>  -------- Show input file name here. --------</label>
      </Box>
    );
  }
}

function UploadButtons(props) {
  const classes = useStyles(props);
  return (
    <div>
      <input
        accept="image/*"
        className={classes.input}
        id="contained-button-file"
        multiple
        type="file"
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span">
          Load a binary file
        </Button>
      </label>
    </div>
  );
}

export default App;
