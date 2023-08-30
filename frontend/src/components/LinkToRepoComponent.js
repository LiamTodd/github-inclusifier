import TextField from '@mui/material/TextField';
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import { DARK_GREY, ERROR, LIGHT_PURPLE, WHITE } from '../constants';
import { useState, useEffect, useCallback } from 'react';
import { fetchData } from '../utils/apiUtils';

function LinkToRepoComponent({
  handleSetRepoName,
  handleSetRawFileData,
  handleSetDefaultBranch,
  handleSetRepoCodeAnalysis,
}) {
  const [userName, setUserName] = useState('');
  const [repoName, setRepoName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [generateGithubIssue, setGenerateGithubIssue] = useState(false);
  const [formReady, setFormReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const wrapperSetErrorMessage = useCallback(
    (val) => {
      setErrorMessage(val);
    },
    [setErrorMessage]
  );
  const wrapperSetLoading = useCallback(
    (val) => {
      setLoading(val);
    },
    [setLoading]
  );

  const linkToRepoHandler = () => {
    fetchData(
      userName,
      repoName,
      accessToken,
      generateGithubIssue,
      handleSetRepoName,
      handleSetRawFileData,
      wrapperSetErrorMessage,
      wrapperSetLoading,
      handleSetDefaultBranch,
      handleSetRepoCodeAnalysis
    );
  };

  useEffect(() => {
    const allFilled = userName && repoName && accessToken;
    setFormReady(allFilled);
  }, [userName, repoName, accessToken]);
  return (
    <>
      {loading ? (
        <Box
          sx={{
            color: LIGHT_PURPLE,
            height: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress color='inherit' size='5vw' />
        </Box>
      ) : (
        <Box
          sx={{
            backgroundColor: DARK_GREY,
            height: 1,
            width: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: 0.6,
            }}
          >
            <TextField
              sx={{
                input: { color: WHITE },
                paddingBottom: '2vh',
              }}
              InputProps={{
                sx: {
                  '&:focus-within fieldset, &:focus-visible fieldset': {
                    borderColor: `${LIGHT_PURPLE}!important`,
                  },
                },
              }}
              InputLabelProps={{
                style: {
                  color: WHITE,
                },
              }}
              FormHelperTextProps={{
                sx: {
                  color: ERROR,
                },
              }}
              required
              id='repo-name'
              label='GitHub repo name'
              placeholder="Please enter the repository's name."
              value={repoName}
              onChange={(e) => {
                setRepoName(e.target.value);
              }}
            />
            <TextField
              sx={{
                input: { color: WHITE },
                paddingBottom: '2vh',
              }}
              InputProps={{
                sx: {
                  '&:focus-within fieldset, &:focus-visible fieldset': {
                    borderColor: `${LIGHT_PURPLE}!important`,
                  },
                },
              }}
              InputLabelProps={{
                style: {
                  color: WHITE,
                },
              }}
              FormHelperTextProps={{
                sx: {
                  color: ERROR,
                },
              }}
              required
              id='username'
              label='GitHub username'
              placeholder="Please enter the repo owner's GitHub username."
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
            <TextField
              sx={{ input: { color: WHITE }, paddingBottom: '2vh' }}
              InputProps={{
                sx: {
                  '&:focus-within fieldset, &:focus-visible fieldset': {
                    borderColor: `${LIGHT_PURPLE}!important`,
                  },
                },
              }}
              InputLabelProps={{
                style: {
                  color: WHITE,
                },
              }}
              FormHelperTextProps={{
                sx: {
                  color: ERROR,
                },
              }}
              id='access-token'
              required
              label='Access token'
              type='password'
              placeholder="Please enter a GitHub access token with 'repo' permissions."
              value={accessToken}
              onChange={(e) => {
                setAccessToken(e.target.value);
              }}
            />

            <FormControlLabel
              label='Report non-inclusive language with a GitHub issue'
              labelPlacement='end'
              control={
                <Checkbox
                  sx={{
                    '&.Mui-checked': {
                      color: LIGHT_PURPLE,
                    },
                    color: LIGHT_PURPLE,
                  }}
                  onChange={() => {
                    setGenerateGithubIssue(!generateGithubIssue);
                  }}
                />
              }
            />

            <Button
              variant='outlined'
              sx={{
                color: LIGHT_PURPLE,
                borderColor: LIGHT_PURPLE,
                '&:disabled': {
                  color: ERROR,
                  borderColor: ERROR,
                },
                '&:hover': {
                  borderColor: LIGHT_PURPLE,
                },
              }}
              disabled={!formReady}
              onClick={linkToRepoHandler}
            >
              {formReady ? 'Link to repo' : 'Please provide credentials'}
            </Button>
            {errorMessage ? (
              <Typography
                sx={{
                  color: ERROR,
                }}
              >
                {errorMessage}
              </Typography>
            ) : null}
          </Box>
        </Box>
      )}
    </>
  );
}

export default LinkToRepoComponent;
