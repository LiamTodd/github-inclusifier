import { useState, useCallback, useEffect } from 'react';
import { fetchCodeAnalysis } from '../utils/apiUtils';
import { Box, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import {
  BLACK,
  ERROR,
  FLAT_NON_INCLUSIVE_TERMS,
  LIGHT_PURPLE,
  WHITE,
} from '../constants';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

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

  const ListItem = styled(Paper)(({ color }) => ({
    backgroundColor: BLACK,
    padding: '2vh',
    color: color,
    fontFamily: 'Courier New',
  }));

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
        <div>{errorMessage}</div>
      ) : codeAnalysis ? (
        <>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Stack spacing={2}>
                  <Typography variant='h5'>Functions</Typography>
                  {codeAnalysis.functions.map((func) => {
                    let color = WHITE;
                    if (FLAT_NON_INCLUSIVE_TERMS.includes(func)) {
                      color = ERROR;
                    }
                    return (
                      <ListItem key={`func-${func}`} color={color}>
                        {func}
                      </ListItem>
                    );
                  })}
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={2}>
                  <Typography variant='h5'>Variables</Typography>
                  {codeAnalysis.variables.map((variable) => {
                    let color = WHITE;
                    if (FLAT_NON_INCLUSIVE_TERMS.includes(variable)) {
                      color = ERROR;
                    }
                    return (
                      <ListItem key={`variable-${variable}`} color={color}>
                        {variable}
                      </ListItem>
                    );
                  })}
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </>
      ) : null}
    </div>
  );
}

export default CodeAnalysisComponent;
