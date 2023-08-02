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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';

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
  const [backButtonActive, setBackButtonActive] = useState(false);

  useEffect(() => {
    setBackButtonActive(
      (rawFileData && repoName) || (rawFileData && repoName && selectedFileData)
    );
  }, [rawFileData, selectedFileData, repoName]);

  // update local storage
  useEffect(() => {
    window.localStorage.setItem(REPO_NAME_KEY, JSON.stringify(repoName));
    window.localStorage.setItem(RAW_FILE_DATA_KEY, JSON.stringify(rawFileData));
    window.localStorage.setItem(
      SELECTED_FILE_DATA_KEY,
      JSON.stringify(selectedFileData)
    );
  }, [repoName, rawFileData, selectedFileData]);

  const handleBackClick = () => {
    if (selectedFileData) {
      // if on file detail page
      setSelectedFileData(null);
    } else if (rawFileData && repoName) {
      // if on repo view
      setRawFileData(null);
      setRepoName(null);
    }
  };

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
          paddingTop: '1vh',
          paddingLeft: '1vw',
          color: WHITE,
          backgroundColor: BLACK,
          marginBottom: 0,
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
      <Box>
        <Box
          sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 0,
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
          <Box sx={{ alignItems: 'left', width: 1, paddingLeft: '1vw' }}>
            <IconButton
              aria-label='back'
              sx={{ color: WHITE }}
              onClick={handleBackClick}
              disabled={!backButtonActive}
            >
              <ArrowBackIcon fontSize='large' />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
export default AppBackgroundComponent;
