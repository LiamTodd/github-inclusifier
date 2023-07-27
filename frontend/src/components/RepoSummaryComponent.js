import { useState, useEffect } from 'react';
import {
  BLACK,
  DARK_GREY,
  LOCAL_HOST_INCLUSIVE_LANGUAGE_REPORT_URL,
  WHITE,
} from '../constants';
import { processRepoData } from '../utils/repoDataProcessing';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import TreeItem from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';

function RepoSummaryComponent() {
  const [repoData, setRepoData] = useState(null);

  useEffect(() => {
    fetch(LOCAL_HOST_INCLUSIVE_LANGUAGE_REPORT_URL)
      .then((res) => res.json())
      .then((data) => setRepoData(processRepoData(data)));
    console.log(repoData);
  });
  return (
    <Box sx={{ backgroundColor: BLACK }}>
      <Typography
        variant='h1'
        gutterBottom
        sx={{ fontSize: '2rem', padding: '1vw', color: WHITE }}
      >
        User/RepoName
      </Typography>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          marginX: 'auto',
        }}
      >
        <TreeView
          aria-label='file system navigator'
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
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
          <TreeItem nodeId='1' label='Applications'>
            <TreeItem nodeId='2' label='Calendar' />
          </TreeItem>
          <TreeItem nodeId='3' label='Documents'>
            <TreeItem nodeId='4' label='OSS' />
            <TreeItem nodeId='5' label='MUI'>
              <TreeItem nodeId='4' label='index.js' />
            </TreeItem>
          </TreeItem>
        </TreeView>
      </Box>
    </Box>
  );
}

export default RepoSummaryComponent;
