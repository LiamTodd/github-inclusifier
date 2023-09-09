import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import {
  DARK_GREY,
  ERROR,
  LIGHT_PURPLE,
  REPO_NAME_KEY,
  WHITE,
} from '../constants';
import { capitalizeFirstLetters } from '../utils/stringUtils';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { doCodeRefactors } from '../utils/apiUtils';
import { getRepoNameFromExtendedName } from '../utils/stringUtils';

function RefactorDialogComponent({
  language,
  handleSetShowModal,
  codeAnalysis,
}) {
  const [refactors, setRefactors] = useState({
    functions: [],
    variables: [],
    classes: [],
  });
  const [accessToken, setAccessToken] = useState('');
  const [userName, setUserName] = useState('');
  const [formReady, setFormReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const wrapperSetLoading = useCallback((val) => setLoading(val), [setLoading]);
  const wrapperSetErrorMessage = useCallback(
    (val) => setErrorMessage(val),
    [setErrorMessage]
  );

  const handleRenameChange = (newValue, term, type, index) => {
    const updatedValues = { ...refactors };
    if (newValue) {
      updatedValues[type][index] = {
        newName: newValue,
        oldName: term,
        type: type,
      };
    } else {
      updatedValues[type].pop(index);
    }
    setRefactors(updatedValues);
  };

  useEffect(() => {
    let allEmpty = true;
    for (const list of Object.values(refactors)) {
      if (list.length > 0) {
        allEmpty = false;
        break;
      }
    }
    let noSpaces = true;
    for (const list of Object.values(refactors)) {
      for (const refactor of list) {
        if (refactor.newName.includes(' ')) {
          noSpaces = false;
          break;
        }
      }
    }
    setFormReady(!allEmpty && userName && accessToken && noSpaces);
  }, [refactors, userName, accessToken]);

  const handleConfirm = () => {
    doCodeRefactors(
      wrapperSetLoading,
      wrapperSetErrorMessage,
      refactors,
      language,
      userName,
      accessToken,
      getRepoNameFromExtendedName(
        JSON.parse(localStorage.getItem(REPO_NAME_KEY))
      )
    );
  };

  return (
    <Box sx={{ backgroundColor: DARK_GREY, color: WHITE }}>
      <DialogTitle>Refactor {language} code</DialogTitle>
      <DialogContent>
        {Object.entries(codeAnalysis).map(([type, terms]) => {
          return (
            <>
              <Typography
                sx={{
                  color: WHITE,
                }}
              >
                {capitalizeFirstLetters(type)}
              </Typography>
              <Divider color={WHITE} />
              {Object.keys(terms).map((term, index) => {
                return (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1vh',
                    }}
                    key={`${type}-${index}`}
                  >
                    <span style={{ color: ERROR }}>{term}</span>
                    <KeyboardDoubleArrowRightIcon />
                    <TextField
                      sx={{
                        input: { color: WHITE },
                        '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline':
                          {
                            borderColor: ERROR,
                          },
                        '& .MuiFormHelperText-root.Mui-error': {
                          color: ERROR,
                        },
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
                      error={
                        refactors[type][index]
                          ? refactors[type][index].newName.includes(' ')
                          : false
                      }
                      helperText={
                        refactors[type][index]
                          ? refactors[type][index].newName.includes(' ')
                            ? 'New names cannot include spaces.'
                            : null
                          : null
                      }
                      placeholder='New name'
                      onChange={(e) => {
                        handleRenameChange(e.target.value, term, type, index);
                      }}
                    />
                  </Box>
                );
              })}
            </>
          );
        })}
      </DialogContent>
      <Box sx={{ display: 'flex', flexDirection: 'col', padding: '1vw' }}>
        <TextField
          sx={{
            input: { color: WHITE },
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
          sx={{ input: { color: WHITE } }}
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
      </Box>

      <DialogActions sx={{ color: LIGHT_PURPLE }}>
        <Button
          sx={{ color: 'inherit' }}
          onClick={() => {
            handleSetShowModal(false);
          }}
        >
          Cancel
        </Button>
        <Button
          sx={{
            color: 'inherit',
            '&:disabled': {
              color: ERROR,
              borderColor: ERROR,
            },
          }}
          onClick={handleConfirm}
          disabled={!formReady}
        >
          Confirm
        </Button>
      </DialogActions>
    </Box>
  );
}

export default RefactorDialogComponent;
