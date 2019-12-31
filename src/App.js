import React from 'react';
// import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import HexBookmarkBody from './HexBookmarkBody'


function App(props) {
  const classes = useStyles(props);
  return (
    <div className={classes.app}>
      <HexBookmarkApp />
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
    </div>
  );
}

const backgroundShape = require('./images/shape.svg');
const logo = require('./images/logo.svg');
const theme = createMuiTheme({
  typography: {
    fontFamily: [
      '"Courier New"',
      'Consolas',
      'monospace',
    ].join(','),
  },
  palette: {
    primary: {
      light: '#d9d9d9',
      main: '#7b7b7b',
      dark: '#262626',
      contrastText: '#fff',
    },
    secondary: {
      light: '#d9d9d9',
      main: '#7b7b7b',
      dark: '#262626',
      contrastText: '#fff',
    },

  },
});

const useStyles = makeStyles(theme => ({
  app: {
    textAlign: 'center',
    flexGrow: 1,
    backgroundColor: theme.palette.grey['100'],
    overflow: 'hidden',
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: 'cover',
    backgroundPosition: '0 200px',
    paddingBottom: 200
  },
}));

function HexBookmarkApp(props) {
  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography
              variant="h3"
              color="inherit"
            >
              Hex Bookmark
            </Typography>
            <div style={{ marginLeft: '1.5em' }}>
              <img width={50} height={50} src={logo} alt="" />
            </div>
          </Toolbar>
        </AppBar>
        <HexBookmark />
      </MuiThemeProvider>
    </div>
  );
}

class HexBookmark extends React.Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.bookmarkFile = React.createRef();
  }
  render() {
    return (
      <div>
        <HexBookmarkBody
          fin={this.fileInput}
          bookmarkFile={this.bookmarkFile}
        />
      </div>
    );
  }
}

export default App;
