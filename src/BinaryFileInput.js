import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import FileSelectButton from './FileSelectButton'
import Container from '@material-ui/core/Container';

export default function BinaryFileInput(props) {
  function handleFileSelect(newFileInfo, newData) {
    props.onChange(newFileInfo, newData);
  }
  return (
    <Container>
      <Box
        boxShadow={3}
        bgcolor="background.paper"
        mt={3}
        p={3}
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
    </Container>
  );
}

function FileInput(props) {

  function handleFileSelect(event) {
    event.preventDefault();
    let f = props.fin.current.files[0];
    let fileInfo = f.name
    let data = "";
    props.onChange(fileInfo, data);
  }

  return (
    <div>
      <FileSelectButton
        strId="open-binnary-file-button"
        fin={props.fin}
        onChange={handleFileSelect}
        label="Open"
      />
    </div>
  );
}