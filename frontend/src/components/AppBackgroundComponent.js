import { useState, useCallback, useEffect } from 'react';
import {
  APP_NAME,
  BLACK,
  DARK_GREY,
  RAW_FILE_DATA_KEY,
  REPO_NAME_KEY,
  SELECTED_FILE_DATA_KEY,
  WHITE,
} from '../constants';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RepoSummaryComponent from './RepoSummaryComponent.js';
import FileDetailComponent from './FileDetailComponent';
import { generateHeaderFromDoubleRootPath } from '../utils/stringUtils';
import LinkToRepoComponent from './LinkToRepoComponent';

function AppBackgroundComponent() {
  const [repoName, setRepoName] = useState(
    JSON.parse(localStorage.getItem(REPO_NAME_KEY))
  );
  const [rawFileData, setRawFileData] = useState(
    JSON.parse(localStorage.getItem(RAW_FILE_DATA_KEY))
  );
  const [selectedFileData, setSelectedFileData] = useState(
    JSON.parse(localStorage.getItem(SELECTED_FILE_DATA_KEY))
  );

  // update local storage
  useEffect(() => {
    window.localStorage.setItem(REPO_NAME_KEY, JSON.stringify(repoName));
    window.localStorage.setItem(RAW_FILE_DATA_KEY, JSON.stringify(rawFileData));
    window.localStorage.setItem(
      SELECTED_FILE_DATA_KEY,
      JSON.stringify(selectedFileData)
    );
  }, [repoName, rawFileData, selectedFileData]);

  const wrapperSetSelectedFile = useCallback(
    (val) => {
      setSelectedFileData(val);
    },
    [setSelectedFileData]
  );

  const wrapperSetRepoName = useCallback(
    (val) => setRepoName(val),
    [setRepoName]
  );
  const wrapperSetRawFileData = useCallback(
    (val) => setRawFileData(val),
    [setRawFileData]
  );
  return (
    <Box sx={{ backgroundColor: BLACK }}>
      <Typography
        variant='h1'
        gutterBottom
        sx={{
          fontSize: '2rem',
          padding: '1vw',
          color: WHITE,
          backgroundColor: BLACK,
        }}
      >
        {selectedFileData
          ? generateHeaderFromDoubleRootPath(
              repoName,
              selectedFileData.file_path
            )
          : repoName
          ? repoName
          : APP_NAME}
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
          ) : rawFileData ? (
            <RepoSummaryComponent
              rawFileData={rawFileData}
              handleSetSelectedFile={wrapperSetSelectedFile}
            />
          ) : (
            <LinkToRepoComponent
              handleSetRepoName={wrapperSetRepoName}
              handleSetRawFileData={wrapperSetRawFileData}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default AppBackgroundComponent;
