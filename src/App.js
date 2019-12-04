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
    ascii: 8,
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
    [dtypeEnum.ascii]: 'ascii',
  }
  const dtypeSize = {
    [dtypeEnum.int8]: 1,
    [dtypeEnum.uint8]: 1,
    [dtypeEnum.int16]: 2,
    [dtypeEnum.uint16]: 2,
    [dtypeEnum.int32]: 4,
    [dtypeEnum.uint32]: 4,
    [dtypeEnum.float32]: 4,
    [dtypeEnum.float64]: 8,
    [dtypeEnum.ascii]: 1,
  }
  const defaultDtype = dtypeEnum.int32;
  const defaultDsize = dtypeSize[dtypeEnum.int32];
  const [state, setState] = React.useState({
    columns: [
      { title: 'Offset', field: 'offset' },
      { title: 'Name', field: 'name' },
      {
        title: 'Data Type',
        field: 'dataType',
        lookup: dtypeLookup,
      },
      { title: 'Data size', field: 'dataSize' },
      { title: 'Value', field: 'value', type: 'numeric', editable: 'never' },
      { title: 'Hex Dump', field: 'hexDump', editable: 'never' },
    ],
    data: [
      { offset: '0x00000000', name: '', dataType: defaultDtype, dataSize: defaultDsize, value: '', hexDump: '' },
    ],
    isLittleEndian: false,
  });


  function validateDataSize(newData) {
    const dtype = parseInt(newData['dataType']);
    if (dtype === dtypeEnum.ascii) {
      const maxLetters = 100;
      const minLetters = 1;
      let dataSizeInt = parseInt(newData['dataSize']);
      if (isNaN(dataSizeInt) || dataSizeInt < minLetters || dataSizeInt > maxLetters) {
        newData['dataSize'] = 1;
      }
      else {
        newData['dataSize'] = dataSizeInt;
      }
    }
    else {
      console.log("not ascii");
      newData['dataSize'] = dtypeSize[dtype];
    }
  }

  function validateName(newData) {
    const maxNameLength = 100;
    if (typeof newData['name'] == 'undefined') {
      return;
    }
    if (newData['name'].length > maxNameLength) {
      newData['name'] = newData['name'].slice(0, maxNameLength);
    }
  }

  function validateInput(oldData, newData) {
    // validate offset
    const offsetInt = parseInt(newData['offset']);
    const minOffset = 0;
    const maxOffset = 18446744073709551615; // = Math.pow(2, 64) - 1
    if (isNaN(offsetInt) || offsetInt < minOffset || offsetInt > maxOffset) {
      newData['offset'] = '0x0000'
    }
    // validate dataType
    if (typeof newData['dataType'] == 'undefined') {
      newData['dataType'] = defaultDtype;
      console.log('defaultDtype :', defaultDtype);
    }
    // validate dataSize
    validateDataSize(newData);
    validateName(newData);
    setState(prevState => {
      const data = [...prevState.data];
      data[data.indexOf(oldData)] = newData;
      return { ...prevState, data };
    });
  }
  function getAsciiChars(dataView, offsetInt, numLetters, isLittleEndian) {
    let byteArr = [];
    const firstLetter = 32; // 'SP'
    const lastLetter = 126; // '~'
    const defaultLetter = 46; // '.'
    const sizeOfChar = 1;
    for (let i = 0; i < numLetters; ++i) {
      let val = dataView.getUint8(offsetInt + i * sizeOfChar, isLittleEndian);
      if (val < firstLetter || val > lastLetter) {
        val = defaultLetter;
      }
      byteArr.push(val);
    }
    let res = String.fromCharCode(...byteArr);
    return res;
  }

  function readAsType(dtype, bufferView, offsetInt, dataSize) {
    let res = 0;
    // check bounds of data
    if (offsetInt + dataSize > bufferView.byteLength) {
      return 'Offset out of bounds';
    }

    // read data
    if (dtype === dtypeEnum.int8) {
      res = bufferView.getInt8(offsetInt, state.isLittleEndian);
    }
    else if (dtype === dtypeEnum.uint8) {
      res = bufferView.getUint8(offsetInt, state.isLittleEndian);
    }
    else if (dtype === dtypeEnum.int16) {
      res = bufferView.getInt16(offsetInt, state.isLittleEndian);
    }
    else if (dtype === dtypeEnum.uint16) {
      res = bufferView.getUint16(offsetInt, state.isLittleEndian);
    }
    else if (dtype === dtypeEnum.int32) {
      res = bufferView.getInt32(offsetInt, state.isLittleEndian);
    }
    else if (dtype === dtypeEnum.uint32) {
      res = bufferView.getUint32(offsetInt, state.isLittleEndian);
    }
    else if (dtype === dtypeEnum.float32) {
      res = bufferView.getFloat32(offsetInt, state.isLittleEndian);
    }
    else if (dtype === dtypeEnum.float64) {
      res = bufferView.getFloat64(offsetInt, state.isLittleEndian);
    }
    else if (dtype === dtypeEnum.ascii) {
      res = getAsciiChars(bufferView, offsetInt, dataSize, state.isLittleEndian);
    }
    else {
      console.log('Unkown Data Type!');
    }
    return res;
  }

  function buf2hex(byteArray) { // buffer is an ArrayBuffer
    let hexArr = [];
    hexArr.push(...Array.prototype.map.call(
      byteArray,
      x => ('00' + x.toString(16).toUpperCase()).slice(-2)
    ));
    return hexArr.join('');
  }

  function readAsHex(buffer, offsetInt, dataSizeInt) {
    // check bounds of data
    if (offsetInt + dataSizeInt > buffer.byteLength) {
      return '';
    }
    let byteArr = new Uint8Array(buffer);
    return buf2hex(byteArr.slice(offsetInt, offsetInt + dataSizeInt));
  }

  function readValue(fin, oldData, newData) {
    let f = fin.current.files[0];
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
        const dataSizeInt = parseInt(newData.dataSize);
        const readData = readAsType(dtypeInt, view, offsetInt, dataSizeInt);
        const hexDump = readAsHex(buffer, offsetInt, dataSizeInt);
        setState(prevState => {
          const data = [...prevState.data];
          newData['value'] = readData;
          newData['hexDump'] = hexDump;
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

  function formatInput(newData) {
    formatOffset(newData);
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
              formatInput(newData)
              readValue(props.fin, newData, newData);
            }, 0);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            resolve();
            if (oldData) {
              validateInput(oldData, newData);
              formatInput(newData)
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
