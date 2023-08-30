import { useState, useCallback, useEffect } from 'react';
import { fetchCodeAnalysis } from '../utils/apiUtils';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { ERROR, LIGHT_PURPLE } from '../constants';
import FuncVarCodeComponent from './FuncVarCodeComponent';
import CommentCodeComponent from './CommentCodeComponent';

function CodeAnalysisComponent({ languageMode, selectedFileData }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [codeAnalysis, setCodeAnalysis] = useState(null);

  const wrapperSetLoading = useCallback((val) => setLoading(val), [setLoading]);
  const wrapperSetErrorMessage = useCallback(
    (val) => setErrorMessage(val),
    [setErrorMessage]
  );
  const wrapperSetCodeAnalysis = useCallback(
    (val) => setCodeAnalysis(val),
    [setCodeAnalysis]
  );

  useEffect(() => {
    fetchCodeAnalysis(
      languageMode,
      selectedFileData.content,
      wrapperSetErrorMessage,
      wrapperSetLoading,
      wrapperSetCodeAnalysis
    );
  }, [
    languageMode,
    selectedFileData,
    wrapperSetCodeAnalysis,
    wrapperSetLoading,
    wrapperSetErrorMessage,
  ]);

  return (
    <div>
      {loading ? (
        <Box
          sx={{
            color: LIGHT_PURPLE,
            marginTop: '20%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CircularProgress color='inherit' size='5vw' />
        </Box>
      ) : errorMessage ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'col',
            justifyContent: 'center',
            paddingTop: '20vh',
          }}
        >
          <Typography variant='h6' sx={{ color: ERROR }}>
            {errorMessage}
          </Typography>
        </Box>
      ) : codeAnalysis ? (
        <>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <FuncVarCodeComponent
                elements={codeAnalysis.functions}
                elementType={'Functions'}
              />
              <FuncVarCodeComponent
                elements={codeAnalysis.variables}
                elementType={'Variables'}
              />
              <CommentCodeComponent comments={codeAnalysis.comments} />
            </Grid>
          </Box>
        </>
      ) : null}
    </div>
  );
}

export default CodeAnalysisComponent;
