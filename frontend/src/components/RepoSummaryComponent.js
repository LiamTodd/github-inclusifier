import { generateTreeView } from '../utils/generateTreeViewUtils';

function RepoSummaryComponent({ rawFileData, handleSetSelectedFile }) {
  return (
    <>
      {' '}
      {rawFileData && handleSetSelectedFile
        ? generateTreeView(rawFileData, handleSetSelectedFile)
        : null}
    </>
  );
}

export default RepoSummaryComponent;
