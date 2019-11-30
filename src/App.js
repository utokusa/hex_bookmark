import React from 'react';
// import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';

function App(props) {
  const classes = useStyles(props);
  return (
    <div className={classes.app}>
      <HexBookmark />
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
    </div>
  );
}

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

// const styles = theme => ({
//   input: {
//     display: 'none',
//   },
// });

// --------------------------------------------------------------------------
class HexBookmark extends React.Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.state = { fileInfo: "file name here", data: "" };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(newFileInfo, newData) {
    this.setState({ fileInfo: newFileInfo, data: newData });
    console.log(newData);
  }

  render() {
    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="h3" color="inherit">
              Hex Bookmark
            </Typography>
          </Toolbar>
        </AppBar>
        <BinaryFileInput
          fin={this.fileInput}
          onSubmit={this.handleSubmit}
          fileInfo={this.state.fileInfo}
          data={this.state.data}
        />
        <Bookmark
          fin={this.fileInput}
        />
      </div>
    );
  }
}

// --------------------------------------------------------------------------
class Bookmark extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <Box
        boxShadow={3}
        bgcolor="background.paper"
        m={5}
        p={1}
        style={{ width: '45rem', height: '50rem' }}
      >
        <BookmarkTable
          fin={this.props.fin}
        />
      </Box>

    );
  }
}

function BookmarkTable(props) {
  const [state, setState] = React.useState({
    columns: [
      { title: 'Hex Offset', field: 'hexOffset' },
      {
        title: 'Data Type',
        field: 'dataType',
        lookup: { 0: 'int16', 1: 'int32', 2: 'int64' },
      },
      { title: 'Value', field: 'value', type: 'numeric', editable: 'never' },
      { title: 'Hex', field: 'hex', editable: 'never' },
    ],
    data: [
      { hexOffset: '0x00000000', dataType: 2, value: 0, hex: '0x00000000' },
    ],
  });

  function readValue(fin, oldData, newData) {
    let f = fin.current.files[0];
    let readData = -1;
    if (typeof f !== 'undefined') {
      let reader = new FileReader();
      reader.onload = function (e) {
        let buffer = reader.result;
        let view = new DataView(buffer);
        console.log('newData[hexOffsets]')
        console.log(newData['hexOffset'])
        const offsetInt = parseInt(newData['hexOffset']);
        console.log('offsetInt')
        console.log(offsetInt)
        if (isNaN(offsetInt)) {
          setState(prevState => {
            const data = [...prevState.data];
            newData['value'] = 'Invalid Offset';
            data[data.indexOf(oldData)] = newData;
            return { ...prevState, data };
          });
          return;
        }
        const readData = view.getInt32(offsetInt);
        setState(prevState => {
          const data = [...prevState.data];
          newData['value'] = readData;
          data[data.indexOf(oldData)] = newData;
          return { ...prevState, data };
        });
      }
      reader.onerror = function (e) {
        console.log('onerror');
      };
      reader.onload = reader.onload.bind(this);
      reader.readAsArrayBuffer(f);
    }
    else {
      console.log('case undefined');
    }
  }

  return (
    <MaterialTable
      title="Bookmarks"
      columns={state.columns}
      data={state.data}
      editable={{
        onRowAdd: newData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              setState(prevState => {
                const data = [...prevState.data];
                data.push(newData);
                return { ...prevState, data };
              });
              readValue(props.fin, newData, newData);
            }, 0);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            resolve();
            if (oldData) {
              readValue(props.fin, oldData, newData);
            }
          }),
        onRowDelete: oldData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              setState(prevState => {
                const data = [...prevState.data];
                data.splice(data.indexOf(oldData), 1);
                return { ...prevState, data };
              });
            }, 0);
          }),
      }}
    />
  );
}

// --------------------------------------------------------------------------
class BinaryFileInput extends React.Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.test = "aaa";
    this.state = { fileInfo: "file name here", data: "" };
    this.handleSubmit = this.handleSubmit.bind(this);

    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Great success! All the File APIs are supported.
    } else {
      alert('The File APIs are not fully supported in this browser.');
    }
  }

  handleSubmit(newFileInfo, newData) {
    // this.setState({ fileInfo: newFileInfo, data: newData });
    this.props.onSubmit(newFileInfo, newData);
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
        <FileInput
          fin={this.props.fin}
          onSubmit={this.handleSubmit}
        />
        <div>
          <label>  -------- {this.props.fileInfo} --------  </label>
        </div>
        <div>
          <label> {this.props.data} </label>
        </div>
      </Box>
    );
  }
}

class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    let msg = "Select File"
    let f = this.props.fin.current.files[0];
    let data = "abc";
    if (typeof f !== 'undefined') {
      msg = f.name + " : " + f.lastModifiedDate.toLocaleDateString();
      let reader = new FileReader();
      reader.onload = function (e) {
        let buffer = reader.result;
        let view = new DataView(buffer);
        data = view.getInt32(0).toString();
        this.props.onSubmit(msg, data);
        return;
      }
      reader.onerror = function (e) {
        console.error('reading failed');
      };
      reader.onload = reader.onload.bind(this);
      reader.readAsArrayBuffer(f);
    }
    else {
      this.props.onSubmit(msg, data);
    }

  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Input Binary File :
          <input type="file" ref={this.props.fin} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    );
  }
}

export default App;
