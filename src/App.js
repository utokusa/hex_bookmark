import React from 'react';
// import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MaterialTable, { MTableToolbar } from 'material-table';

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
        style={{ width: '70rem', height: '50rem' }}
      >
        <BookmarkTable
          fin={this.props.fin}
        />
      </Box>

    );
  }
}

function BookmarkTable(props) {
  const dtypeEnum = {
    int8: 0,
    uint8: 1,
    int16: 2,
    uint16: 3,
    int32: 4,
    uint32: 5,
    float32: 6,
    float64: 7,
  };
  const dtypeLookup = {
    [dtypeEnum.int8]: 'int8',
    [dtypeEnum.uint8]: 'uint8',
    [dtypeEnum.int16]: 'int16',
    [dtypeEnum.uint16]: 'uint16',
    [dtypeEnum.int32]: 'int32',
    [dtypeEnum.uint32]: 'uint32',
    [dtypeEnum.float32]: 'float32',
    [dtypeEnum.float64]: 'float64',
  }
  const defaultDtype = dtypeEnum.int32;
  const [state, setState] = React.useState({
    columns: [
      { title: 'Offset', field: 'offset' },
      {
        title: 'Data Type',
        field: 'dataType',
        lookup: dtypeLookup,
      },
      { title: 'Value', field: 'value', type: 'numeric', editable: 'never' },
      { title: 'Hex Value', field: 'hexValue', editable: 'never' },
    ],
    data: [
      { offset: '0x00000000', dataType: defaultDtype, value: '', hexValue: '' },
    ],
    isLittleEndian: false,
  });

  function validateInput(oldData, newData) {
    const offsetInt = parseInt(newData['offset']);
    const minOffset = 0;
    const maxOffset = 18446744073709551615; // = Math.pow(2, 64) - 1
    if (isNaN(offsetInt) || offsetInt < minOffset || offsetInt > maxOffset) {
      newData['offset'] = '0x0000'
    }
    if (typeof newData['dataType'] == 'undefined') {
      newData['dataType'] = defaultDtype;
      console.log('defaultDtype :', defaultDtype);
    }
    setState(prevState => {
      const data = [...prevState.data];
      data[data.indexOf(oldData)] = newData;
      return { ...prevState, data };
    });
  }

  function readAsType(dtype, dataView, offsetInt) {
    let res = 0;
    if (dtype === dtypeEnum.int8) {
      res = dataView.getInt8(offsetInt, state.isLittleEndian);
    }
    else if (dtype === dtypeEnum.uint8) {
      res = dataView.getUint8(offsetInt, state.isLittleEndian);
    }
    else if (dtype === dtypeEnum.int16) {
      res = dataView.getInt16(offsetInt, state.isLittleEndian);
    }
    else if (dtype === dtypeEnum.uint16) {
      res = dataView.getUint16(offsetInt, state.isLittleEndian);
    }
    else if (dtype === dtypeEnum.int32) {
      res = dataView.getInt32(offsetInt, state.isLittleEndian);
    }
    else if (dtype === dtypeEnum.uint32) {
      res = dataView.getUint32(offsetInt, state.isLittleEndian);
    }
    else if (dtype === dtypeEnum.float32) {
      res = dataView.getFloat32(offsetInt, state.isLittleEndian);
    }
    else if (dtype === dtypeEnum.float64) {
      res = dataView.getFloat64(offsetInt, state.isLittleEndian);
    }
    else {
      console.log('Unkown Data Type!');
    }
    return res;
  }
  function readValue(fin, oldData, newData) {
    let f = fin.current.files[0];
    let readData = -1;
    console.log('newData[dataType]')
    console.log(newData['dataType'])
    if (typeof f !== 'undefined') {
      let reader = new FileReader();
      reader.onload = function (e) {
        let buffer = reader.result;
        let view = new DataView(buffer);
        console.log('newData[offsets]')
        console.log(newData['offset'])
        const offsetInt = parseInt(newData['offset']);
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
        const dtypeInt = parseInt(newData.dataType);
        const readData = readAsType(dtypeInt, view, offsetInt)
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

  function updateTableValues() {
    console.log('updateTableValues');
    setState(prevState => {
      const data = [...prevState.data];
      console.log('data : ', data);
      for (let x in data) {
        console.log(data[x]);
        validateInput(data[x], data[x]);
        readValue(props.fin, data[x], data[x]);
      }
      return { ...prevState, data };
    });
  }

  function toggleByteOder() {
    setState(prevState => {
      // const isLittleEndian = !prevState.isLittleEndian;
      // console.log('prevState.isLittleEndian : ', prevState.isLittleEndian);
      // return { ...prevState, isLittleEndian }
      prevState.isLittleEndian = !prevState.isLittleEndian;
      console.log('prevState.isLittleEndian : ', prevState.isLittleEndian);
      return { ...prevState }
    });
    updateTableValues();
  }

  function formatOffset(newData) {
    setState(prevState => {
      const data = [...prevState.data];
      const offsetInt = parseInt(newData['offset']);
      const radix = 16;
      const border = 4294967295; // Math.pow(2, 32) - 1
      const numDigits = offsetInt > border ? 16 : 8;
      console.log('numDigits : ', numDigits);
      newData['offset'] = '0x' + ((offsetInt).toString(radix)).toUpperCase().padStart(numDigits, '0');
      data[data.indexOf(newData)] = newData;
      return { ...prevState, data };
    });
  }

  const chipLabel = state.isLittleEndian ? "Little Endian" : "Big Endian";
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
              validateInput(newData, newData);
              formatOffset(newData);
              readValue(props.fin, newData, newData);
            }, 0);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            resolve();
            if (oldData) {
              validateInput(oldData, newData);
              formatOffset(newData);
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
      components={{
        Toolbar: props => (
          <div>
            <MTableToolbar {...props} />
            <div>
              <Chip
                label={chipLabel}
                color="secondary"
                onClick={toggleByteOder}
              />
            </div>
          </div>
        ),
      }}
    />
  );
}

// --------------------------------------------------------------------------
class BinaryFileInput extends React.Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
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
