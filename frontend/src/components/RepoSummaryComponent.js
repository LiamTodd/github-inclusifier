import { generateTreeView } from '../utils/generateTreeViewUtils';

function RepoSummaryComponent({
  rawFileData,
  handleSetSelectedFile,
  handleSetLanguageMode,
}) {
  return (
    <>
      {rawFileData && handleSetSelectedFile
        ? generateTreeView(
            rawFileData,
            handleSetSelectedFile,
            handleSetLanguageMode
          )
        : null}
    </>
  );
}

export default RepoSummaryComponent;
