import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import MaterialTable, { MTableToolbar } from 'material-table';
import FileSelectButton from './FileSelectButton'


const useStyles = makeStyles(theme => ({
  input: {
    display: 'none',
  },
  button: {
    margin: theme.spacing(0.5),
  },
}));

export default function Bookmark(props) {
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
        options={{
          exportButton: true
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
                  className={classes.button}
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
                <FileSelectButton
                  accept="application/json"
                  strId="load-button-file"
                  fin={bookmarkFile}
                  onChange={handleBookmarkLoad}
                  label="Load Bookmark"
                />
              </Box>
            </div>
          ),
        }}
      />
    </div>

  );
}
