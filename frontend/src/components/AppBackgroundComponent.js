import { useState, useEffect, useCallback } from 'react';
import {
  BLACK,
  DARK_GREY,
  LOCAL_HOST_INCLUSIVE_LANGUAGE_REPORT_URL,
  TEST_DATA,
  WHITE,
} from '../constants';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RepoSummaryComponent from './RepoSummaryComponent.js';
import FileDetailComponent from './FileDetailComponent';

function AppBackgroundComponent() {
  const [repoName, setRepoName] = useState(null);
  const [rawFileData, setRawFileData] = useState(null);
  const [selectedFileData, setSelectedFileData] = useState(null);

  const wrapperSetSelectedFile = useCallback(
    (val) => {
      setSelectedFileData(val);
    },
    [setSelectedFileData]
  );

  useEffect(() => {
    // fetch(LOCAL_HOST_INCLUSIVE_LANGUAGE_REPORT_URL)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setRepoName(data.repo);
    //     setRawFileData(data.data);
    //   });
    setRepoName(TEST_DATA.repo);
    setRawFileData(TEST_DATA.data);
  });
  return (
    <Box sx={{ backgroundColor: BLACK }}>
      <Typography
        variant='h1'
        gutterBottom
        sx={{ fontSize: '2rem', padding: '1vw', color: WHITE }}
      >
        {selectedFileData
          ? `${repoName}/${selectedFileData.file_name}`
          : repoName}
      </Typography>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          marginX: 'auto',
        }}
      >
        <Box
          sx={{
            height: 0.7,
            width: 0.7,
            overflow: 'auto',
            backgroundColor: DARK_GREY,
            color: WHITE,
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: '2%',
            paddingRight: '2%',
          }}
        >
          {selectedFileData ? (
            <FileDetailComponent fileData={selectedFileData} />
          ) : (
            <RepoSummaryComponent
              rawFileData={rawFileData}
              handleSetSelectedFile={wrapperSetSelectedFile}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default AppBackgroundComponent;
