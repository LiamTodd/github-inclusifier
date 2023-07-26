import './App.css';
import { useState, useEffect } from 'react';
import { LOCAL_HOST_INCLUSIVE_LANGUAGE_REPORT_URL } from './constants';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
function App() {
  const [repoData, setRepoData] = useState(null);

  useEffect(() => {
    fetch(LOCAL_HOST_INCLUSIVE_LANGUAGE_REPORT_URL)
      .then((res) => res.json())
      .then((data) => setRepoData(data.data));
    console.log(repoData);
  });
  return (
    <div className='App'>
      <TreeView
        aria-label='file system navigator'
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
      >
        <TreeItem nodeId='1' label='Applications'>
          <TreeItem nodeId='2' label='Calendar' />
        </TreeItem>
        <TreeItem nodeId='5' label='Documents'>
          <TreeItem nodeId='10' label='OSS' />
          <TreeItem nodeId='6' label='MUI'>
            <TreeItem nodeId='8' label='index.js' />
          </TreeItem>
        </TreeItem>
      </TreeView>
    </div>
  );
}

export default App;
