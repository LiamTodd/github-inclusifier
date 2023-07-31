import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import { Chip } from '@mui/material';
import { LIGHT_PURPLE } from '../constants';
import { createElement } from 'react';
import { generateMatchCountDisplay } from './stringUtils';

export const generateTreeView = (fileData, handleSetSelectedFile) => {
  const tree = generateTreeViewAux(fileData[0], handleSetSelectedFile);

  return (
    <TreeView
      aria-label='file system navigator'
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '2%',
        paddingRight: '2%',
      }}
    >
      {tree}
    </TreeView>
  );
};

const generateTreeViewAux = (parent, handleSetSelectedFile) => {
  const children = [];
  if (parent.children) {
    for (const child of parent.children) {
      children.push(generateTreeViewAux(child, handleSetSelectedFile));
    }
  }

  const SSPMFlags = countSSPMFlags(parent);
  const WBPMFlags = countWBPMFlags(parent);

  return createElement(
    TreeItem,
    {
      nodeId: parent.file_path,
      key: parent.file_path,
      label: (
        <div style={{ paddingTop: '1vh' }}>
          {parent.file_name}{' '}
          {SSPMFlags > 0 ? (
            <Chip
              label={generateMatchCountDisplay(SSPMFlags, WBPMFlags)}
              onClick={() => {
                handleSetSelectedFile(parent);
              }}
              variant='outlined'
              sx={{ borderColor: LIGHT_PURPLE, color: LIGHT_PURPLE }}
            />
          ) : null}
        </div>
      ),
    },
    [...children]
  );
};

const countSSPMFlags = (file) => {
  let count = 0;
  if (file.sspm_matches) {
    for (const category of Object.keys(file.sspm_matches)) {
      for (const term of Object.keys(file.sspm_matches[category])) {
        count += file.sspm_matches[category][term].length;
      }
    }
  }

  return count;
};

const countWBPMFlags = (file) => {
  let count = 0;
  if (file.wbpm_matches) {
    for (const category of Object.keys(file.wbpm_matches)) {
      for (const term of Object.keys(file.wbpm_matches[category])) {
        count += file.sspm_matches[category][term].length;
      }
    }
  }

  return count;
};
