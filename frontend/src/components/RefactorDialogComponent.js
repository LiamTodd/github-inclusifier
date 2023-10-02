import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import {
  DARK_GREY,
  ERROR,
  LIGHT_PURPLE,
  REPO_NAME_KEY,
  WBPM_NAME,
  WHITE,
  YELLOW,
} from '../constants';
import { v4 as uuidv4 } from 'uuid';
import {
  capitalizeFirstLetters,
  getPythonNameErrorText,
  isPythonNameIllegal,
} from '../utils/stringUtils';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { doCodeRefactors } from '../utils/apiUtils';
import { getRepoNameFromExtendedName } from '../utils/stringUtils';

function RefactorDialogComponent({
  language,
  handleSetShowModal,
  codeAnalysis,
  allNames,
}) {
  // for now, this is hard-coded to python only as refactoring is only available for python
  const [refactors, setRefactors] = useState({
    functions: [],
    variables: [],
    classes: [],
  });
  const [accessToken, setAccessToken] = useState('');
  const [userName, setUserName] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [uuid, setUuid] = useState('');
  const [formReady, setFormReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pullRequestUrl, setPullRequestUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const wrapperSetLoading = useCallback((val) => setLoading(val), [setLoading]);
  const wrapperSetErrorMessage = useCallback(
    (val) => setErrorMessage(val),
    [setErrorMessage]
  );
  const wrapperSetPullRequestUrl = useCallback(
    (val) => setPullRequestUrl(val),
    [setPullRequestUrl]
  );
  const wrapperSetConfirmed = useCallback(
    (val) => setConfirmed(val),
    [setConfirmed]
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
      updatedValues[type][index] = null;
    }
    setRefactors(updatedValues);
  };

  useEffect(() => {
    setUuid(uuidv4());
  }, []);

  useEffect(() => {
    let allEmpty = true;
    for (const list of Object.values(refactors)) {
      for (const element of list) {
        if (element !== undefined && element !== null) {
          allEmpty = false;
          break;
        }
      }
    }
    let legalName = true;
    for (const type of Object.keys(refactors)) {
      for (const refactor of refactors[type]) {
        if (
          refactor &&
          isPythonNameIllegal(
            refactor.newName,
            refactor.oldName,
            allNames,
            refactors,
            type
          )
        ) {
          legalName = false;
          break;
        }
      }
    }

    setFormReady(
      !allEmpty &&
        userName &&
        accessToken &&
        legalName &&
        commitMessage &&
        !confirmed
    );
  }, [refactors, userName, accessToken, commitMessage, confirmed, allNames]);

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
      ),
      commitMessage,
      uuid,
      wrapperSetPullRequestUrl,
      wrapperSetConfirmed
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: DARK_GREY,
        color: WHITE,
        paddingLeft: '2vw',
        paddingRight: '2vw',
      }}
    >
      <DialogTitle>Refactor {language} code</DialogTitle>
      <DialogContent>
        {Object.entries(codeAnalysis)
          .filter(([type, _]) => {
            // unable to refactor aliases
            return type !== 'aliases';
          })
          .map(([type, terms]) => {
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
                {Object.entries(terms).map(([term, details], index) => {
                  return (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1vh',
                      }}
                      key={`${type}-${term}-${index}`}
                    >
                      <span
                        style={{
                          color:
                            details.algorithm === WBPM_NAME ? ERROR : YELLOW,
                        }}
                      >
                        {term}
                      </span>
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
                            '&:focus-within fieldset, &:focus-visible fieldset':
                              {
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
                            ? isPythonNameIllegal(
                                refactors[type][index].newName,
                                refactors[type][index].oldName,
                                allNames,
                                refactors,
                                type
                              )
                            : false
                        }
                        helperText={
                          refactors[type][index]
                            ? getPythonNameErrorText(
                                refactors[type][index].newName,
                                refactors[type][index].oldName,
                                allNames,
                                refactors,
                                type
                              )
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
      <Box sx={{ padding: '1vw' }}>
        <TextField
          sx={{
            input: { color: WHITE },
            width: 1,
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
          id='commit-message'
          label='Commit message'
          value={commitMessage}
          onChange={(e) => {
            setCommitMessage(e.target.value);
          }}
        />
      </Box>
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
          value={accessToken}
          onChange={(e) => {
            setAccessToken(e.target.value);
          }}
        />
      </Box>
      <Box sx={{ padding: '2vw', maxWidth: 1 }}>
        <Typography variant='body1'>
          Changes will be committed to a new branch named
          <br />
          'inclusifier-{uuid}',
        </Typography>
        and a pull request will be raised.
      </Box>
      {loading && (
        <Box
          sx={{
            color: LIGHT_PURPLE,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <CircularProgress color='inherit'></CircularProgress>
        </Box>
      )}
      {pullRequestUrl && (
        <Box sx={{ padding: '2vw', maxWidth: 1 }}>
          <Typography variant='body1'>
            Success!
            <br />
            Review and merge changes{' '}
            <Link
              sx={{
                '&:hover': { color: LIGHT_PURPLE },
              }}
              href={pullRequestUrl}
              color='inherit'
            >
              here
            </Link>
            .
          </Typography>
        </Box>
      )}
      {errorMessage && (
        <Box sx={{ padding: '2vw', maxWidth: 1 }}>
          <Typography color={ERROR}>{errorMessage}</Typography>
        </Box>
      )}

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
