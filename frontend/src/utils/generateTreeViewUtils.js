import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import { DARK_GREY, LIGHT_PURPLE, WHITE } from '../constants';
import { createElement } from 'react';

export const generateTreeView = (fileData) => {
  const tree = generateTreeViewAux(fileData[0]);

  return (
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
      {tree}
    </TreeView>
  );
};

const generateTreeViewAux = (parent) => {
  const children = [];
  if (parent.children) {
    for (const child of parent.children) {
      children.push(generateTreeViewAux(child));
    }
  }

  const SSPMFlags = countSSPMFlags(parent);

  return createElement(
    TreeItem,
    {
      nodeId: parent.file_path,
      key: parent.file_path,
      label: (
        <div>
          {parent.file_name}{' '}
          {SSPMFlags > 0 ? (
            <a style={{ color: LIGHT_PURPLE }} href='https://google.com'>
              {SSPMFlags} instance{SSPMFlags > 1 ? 's ' : ' '}
              of non-inclusive language ha{SSPMFlags > 1 ? 've ' : 's '} been
              flagged
            </a>
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
