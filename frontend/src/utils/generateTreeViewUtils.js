import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import { DARK_GREY, WHITE } from '../constants';
import { createElement } from 'react';

export const generateTreeView = (repoData) => {
  const tree = generateTreeViewAux(repoData[0]);

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

  return createElement(
    TreeItem,
    {
      nodeId: parent.file_path,
      label: parent.file_name,
    },
    children
  );
};
