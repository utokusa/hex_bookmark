import React from 'react';
// import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MaterialTable, { MTableToolbar } from 'material-table';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';


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

function HexBookmarkBody(props) {
  const [inputBin, setInputBin] = React.useState({ fileInfo: "Input Binary File", data: "" });
  function handleChangeInput(newFileInfo, newData) {
    setInputBin({ fileInfo: newFileInfo, data: newData });
  }

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
  const defaultDtypeStr = String(defaultDtype);
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
      { offset: '0x00000000', name: '', dataType: defaultDtypeStr, dataSize: defaultDsize, value: '', hexDump: '' },
    ],
    isLittleEndian: true,
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

  function readAsType(dtype, bufferView, offsetInt, dataSize, isLittleEndian) {
    let res = 0;
    // check bounds of data
    if (offsetInt + dataSize > bufferView.byteLength) {
      return 'Offset out of bounds';
    }

    // read data
    if (dtype === dtypeEnum.int8) {
      res = bufferView.getInt8(offsetInt, isLittleEndian);
    }
    else if (dtype === dtypeEnum.uint8) {
      res = bufferView.getUint8(offsetInt, isLittleEndian);
    }
    else if (dtype === dtypeEnum.int16) {
      res = bufferView.getInt16(offsetInt, isLittleEndian);
    }
    else if (dtype === dtypeEnum.uint16) {
      res = bufferView.getUint16(offsetInt, isLittleEndian);
    }
    else if (dtype === dtypeEnum.int32) {
      res = bufferView.getInt32(offsetInt, isLittleEndian);
    }
    else if (dtype === dtypeEnum.uint32) {
      res = bufferView.getUint32(offsetInt, isLittleEndian);
    }
    else if (dtype === dtypeEnum.float32) {
      res = bufferView.getFloat32(offsetInt, isLittleEndian);
    }
    else if (dtype === dtypeEnum.float64) {
      res = bufferView.getFloat64(offsetInt, isLittleEndian);
    }
    else if (dtype === dtypeEnum.ascii) {
      res = getAsciiChars(bufferView, offsetInt, dataSize, isLittleEndian);
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
    if (typeof f !== 'undefined') {
      let reader = new FileReader();
      reader.onload = function (e) {
        let buffer = reader.result;
        let view = new DataView(buffer);
        const offsetInt = parseInt(newData['offset']);
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
        const readData = readAsType(dtypeInt, view, offsetInt, dataSizeInt, state.isLittleEndian);
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
    setState(prevState => {
      const data = [...prevState.data];
      for (let x in data) {
        validateInput(data[x], data[x]);
        formatInput(data[x], data[x]);
        readValue(props.fin, data[x], data[x]);
      }
      return { ...prevState, data };
    });
  }

  function formatOffset(oldData, newData) {
    setState(prevState => {
      const data = [...prevState.data];
      const offsetInt = parseInt(newData['offset']);
      const radix = 16;
      const border = 4294967295; // Math.pow(2, 32) - 1
      const numDigits = offsetInt > border ? 16 : 8;
      newData['offset'] = '0x' + ((offsetInt).toString(radix)).toUpperCase().padStart(numDigits, '0');
      data[data.indexOf(oldData)] = newData;
      return { ...prevState, data };
    });
  }

  function formatInput(oldData, newData) {
    formatOffset(oldData, newData);
  }

  function handleToggleByteOder() {
    setState(prevState => {
      prevState.isLittleEndian = !prevState.isLittleEndian;
      return { ...prevState }
    });
    updateTableValues();
  }

  function handleSaveBookmark() {
    let bookmark = [];
    for (let x in state.data) {
      let row = state.data[x];
      bookmark.push({ offset: row['offset'], name: row['name'], dataType: row['dataType'], dataSize: row['dataSize'], })
    }
    const string = JSON.stringify(bookmark);
    const blob = new Blob([string], { "type": "text/plain" });
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = 'my_hex_bookmark.json'
    link.click()
  }

  function handleBookmarkLoad() {
    let f = props.bookmarkFile.current.files[0];
    if (typeof f !== 'undefined') {
      let reader = new FileReader();
      reader.onload = function (e) {
        let obj = JSON.parse(e.target.result);
        setState(prevState => {
          const data = [];
          for (let x in obj) {
            data.push(obj[x]);
          }
          return { ...prevState, data };
        });
        updateTableValues();
        return;
      }
      reader.onerror = function (e) {
        console.error('reading failed');
      };
      reader.onload = reader.onload.bind(this);
      reader.readAsText(f);
    }
  }

  function handleRowAdd(newData) {
    return new Promise(resolve => {
      resolve();
      setState(prevState => {
        const data = [...prevState.data];
        data.push(newData);
        return { ...prevState, data };
      });
      validateInput(newData, newData);
      formatInput(newData, newData)
      readValue(props.fin, newData, newData);
    });
  }

  function handleRowUpdate(newData, oldData) {
    return new Promise(resolve => {
      resolve();
      if (oldData) {
        validateInput(oldData, newData);
        formatInput(oldData, newData);
        readValue(props.fin, oldData, newData);
      }
    });
  }

  function handleRowDelete(oldData) {
    return new Promise(resolve => {
      resolve();
      setState(prevState => {
        const data = [...prevState.data];
        data.splice(data.indexOf(oldData), 1);
        return { ...prevState, data };
      });
    });
  }

  return (
    <Box>
      <BinaryFileInput
        fin={props.fin}
        onChange={handleChangeInput}
        fileInfo={inputBin.fileInfo}
        data={inputBin.data}
      />
      <Bookmark
        fin={props.fin}
        onToggleByteOder={handleToggleByteOder}
        onSaveBookmark={handleSaveBookmark}
        onBookmarkLoad={handleBookmarkLoad}
        isLittleEndian={state.isLittleEndian}
        columns={state.columns}
        data={state.data}
        onRowAdd={handleRowAdd}
        onRowUpdate={handleRowUpdate}
        onRowDelete={handleRowDelete}
        bookmarkFile={props.bookmarkFile}
      />
    </Box>
  );
}

function Bookmark(props) {
  return (
    <Box
      m={2}
      p={1}
      style={{ width: '94vw', height: '70rem' }}
    >
      <BookmarkTable
        boxShadow={3}
        bgcolor="background.paper"
        fin={props.fin}
        onToggleByteOder={props.onToggleByteOder}
        onSaveBookmark={props.onSaveBookmark}
        onBookmarkLoad={props.onBookmarkLoad}
        isLittleEndian={props.isLittleEndian}
        columns={props.columns}
        data={props.data}
        onRowAdd={props.onRowAdd}
        onRowUpdate={props.onRowUpdate}
        onRowDelete={props.onRowDelete}
        bookmarkFile={props.bookmarkFile}
      />
    </Box>

  );
}

function BookmarkTable(props) {
  let bookmarkFile = props.bookmarkFile;
  const classes = useStyles();
  function toggleByteOder() {
    props.onToggleByteOder();
  }

  function saveBookmark() {
    props.onSaveBookmark();
  }

  function handleBookmarkLoad() {
    props.onBookmarkLoad();
  }
  const byteOrderLabal = props.isLittleEndian ? "Little Endian" : "Big Endian";
  return (
    <div>
      <MaterialTable
        title="Bookmarks"
        columns={props.columns}
        data={props.data}
        editable={{
          onRowAdd: newData => props.onRowAdd(newData),
          onRowUpdate: (newData, oldData) => props.onRowUpdate(newData, oldData),
          onRowDelete: oldData => props.onRowDelete(oldData),
        }}
        components={{
          Toolbar: props => (
            <div>
              <MTableToolbar {...props} />
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                mx={3}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={toggleByteOder}
                  style={{ width: '9rem' }}
                >
                  {byteOrderLabal}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  className={classes.button}
                  startIcon={<SaveIcon />}
                  onClick={saveBookmark}

                >
                  Save Bookmark
              </Button>
                <input
                  accept="application/json"
                  className={classes.input}
                  id="load-button-file"
                  type="file"
                  ref={bookmarkFile}
                  onChange={handleBookmarkLoad}
                />
                <label htmlFor="load-button-file">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    component="span"
                  >
                    Load Bookmark
                </Button>
                </label>
              </Box>
            </div>
          ),
        }}
      />
    </div>

  );
}


function BinaryFileInput(props) {
  function handleFileSelect(newFileInfo, newData) {
    props.onChange(newFileInfo, newData);
  }
  return (
    <Box
      boxShadow={3}
      bgcolor="background.paper"
      m={3}
      p={4}
      style={{ width: '40rem', height: '1rem' }}
      display="flex"
      flexDirection="row"
      alignItems="center"
    >
      <FileInput
        fin={props.fin}
        onChange={handleFileSelect}
      />
      <Box
        mx={3}
      >
        <Typography noWrap="true" style={{ width: '35rem', textAlign: 'left' }}>
          {props.fileInfo}
        </Typography>
      </Box>
    </Box>
  );
}

function FileInput(props) {
  const classes = useStyles();

  function handleFileSelect(event) {
    event.preventDefault();
    let f = props.fin.current.files[0];
    let fileInfo = f.name
    let data = "";
    props.onChange(fileInfo, data);
  }

  return (
    <div>
      <input
        className={classes.input}
        id="contained-button-file"
        type="file"
        ref={props.fin}
        onChange={handleFileSelect}
      />
      <label htmlFor="contained-button-file">
        <Button
          variant="contained"
          color="primary"
          size="small"
          component="span"
        >
          Open
        </Button>
      </label>
    </div>
  );
}

export default App;
