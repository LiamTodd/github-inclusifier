import { generateTreeView } from '../utils/generateTreeViewUtils';
import Box from '@mui/material/Box';

function RepoSummaryComponent({ rawFileData }) {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        marginX: 'auto',
      }}
    >
      {rawFileData ? generateTreeView(rawFileData) : null}
    </Box>
  );
}

export default RepoSummaryComponent;
