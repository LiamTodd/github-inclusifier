import TextField from '@mui/material/TextField';
import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { DARK_GREY, ERROR, LIGHT_PURPLE, WHITE } from '../constants';
import { useState, useEffect, useCallback } from 'react';
import { fetchData } from '../utils/apiUtils';

function LinkToRepoComponent({ handleSetRepoName, handleSetRawFileData }) {
  const [userName, setUserName] = useState('');
  const [repoName, setRepoName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [formReady, setFormReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const wrapperSetErrorMessage = useCallback(
    (val) => {
      setErrorMessage(val);
    },
    [setErrorMessage]
  );

  useEffect(() => {
    const allFilled = userName && repoName && accessToken;
    setFormReady(allFilled);
  }, [userName, repoName, accessToken]);
  return (
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
          placeholder="PLease enter a GitHub access token with 'repo' permissions."
          value={accessToken}
          onChange={(e) => {
            setAccessToken(e.target.value);
          }}
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
          }}
          disabled={!formReady}
          onClick={() =>
            fetchData(
              userName,
              repoName,
              accessToken,
              handleSetRepoName,
              handleSetRawFileData,
              wrapperSetErrorMessage
            )
          }
        >
          {formReady ? 'Link to repo' : 'Please provide credentials'}
        </Button>
        {errorMessage ? (
          <Typography sx={{ color: ERROR }}>{errorMessage}</Typography>
        ) : null}
      </Box>
    </Box>
  );
}

export default LinkToRepoComponent;
