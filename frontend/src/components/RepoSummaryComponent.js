import { useState, useEffect } from 'react';
import {
  BLACK,
  LOCAL_HOST_INCLUSIVE_LANGUAGE_REPORT_URL,
  WHITE,
} from '../constants';
import { generateTreeView } from '../utils/generateTreeViewUtils';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function RepoSummaryComponent() {
  const [repoTreeView, setRepoTreeView] = useState(null);
  const [repoName, setRepoName] = useState(null);

  useEffect(() => {
    fetch(LOCAL_HOST_INCLUSIVE_LANGUAGE_REPORT_URL)
      .then((res) => res.json())
      .then((data) => {
        setRepoName(data.repo);
        return setRepoTreeView(generateTreeView(data.data));
      });
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
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          marginX: 'auto',
        }}
      >
        {repoTreeView}
      </Box>
    </Box>
  );
}

export default RepoSummaryComponent;
