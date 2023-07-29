import { useState, useEffect } from 'react';
import {
  BLACK,
  LOCAL_HOST_INCLUSIVE_LANGUAGE_REPORT_URL,
  TEST_DATA,
  WHITE,
} from '../constants';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RepoSummaryComponent from './RepoSummaryComponent.js';

function AppBackgroundComponent() {
  const [repoName, setRepoName] = useState(null);
  const [rawFileData, setRawFileData] = useState(null);

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
        {repoName}
      </Typography>
      <RepoSummaryComponent rawFileData={rawFileData}></RepoSummaryComponent>
    </Box>
  );
}

export default AppBackgroundComponent;
