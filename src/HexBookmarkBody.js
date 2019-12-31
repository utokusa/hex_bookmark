import React from 'react';
import Box from '@material-ui/core/Box';
import Bookmark from './Bookmark'
import BinaryFileInput from './BinaryFileInput'

export default function HexBookmarkBody(props) {
  const [inputBin, setInputBin] = React.useState({ fileInfo: "Input Binary File", data: "" });
  function handleChangeInput(newFileInfo, newData) {
    setInputBin({ fileInfo: newFileInfo, data: newData });
    updateTableValues();
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