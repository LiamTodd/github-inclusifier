import {
  Box,
  Chip,
  Dialog,
  Divider,
  Grid,
  List,
  ListItemText,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import {
  BLACK,
  DARK_GREY,
  ERROR,
  LIGHT_PURPLE,
  SUPPORTED_LANGUAGES_REFACTORING,
  WHITE,
} from '../constants';
import { capitalizeFirstLetters } from '../utils/stringUtils';
import { useCallback, useState } from 'react';
import RefactorDialogComponent from './RefactorDialogComponent';

function CodebaseAnalysisComponent({ repoCodeAnalysis }) {
  const [showRefactorModal, setShowRefactorModal] = useState(false);
  const [refactorLanguage, setRefactorLanguage] = useState(null);
  const handleRefactorClick = (language) => {
    setRefactorLanguage(language);
    setShowRefactorModal(true);
  };
  const wrapperSetShowRefactorModal = useCallback(
    (val) => {
      setShowRefactorModal(val);
    },
    [setShowRefactorModal]
  );

  return (
    <>
      <Grid container spacing={2} sx={{ backgroundColor: DARK_GREY }}>
        {Object.entries(repoCodeAnalysis).map(([language, analysis]) => {
          return (
            <Grid
              key={`${language}-analysis`}
              item
              xs={12 / Object.keys(repoCodeAnalysis).length}
            >
              <Stack spacing={2}>
                <Typography
                  variant='h5'
                  sx={{
                    position: 'sticky',
                    top: 0,
                    color: WHITE,
                    padding: '1vh',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'col',
                    }}
                  >
                    {capitalizeFirstLetters(language)}
                    {SUPPORTED_LANGUAGES_REFACTORING.includes(language) && (
                      <Box sx={{ paddingLeft: '1vw' }}>
                        <Chip
                          label='Refactor'
                          onClick={() => {
                            handleRefactorClick(language);
                          }}
                          variant='outlined'
                          sx={{
                            borderColor: LIGHT_PURPLE,
                            color: LIGHT_PURPLE,
                            '&&:hover': {
                              color: BLACK,
                              backgroundColor: LIGHT_PURPLE,
                            },
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Typography>
                <Divider color={WHITE} sx={{ width: '30vw' }} />

                <Grid container>
                  {Object.entries(analysis).map(([type, terms]) => {
                    return (
                      <Grid
                        key={`${language}-${type}`}
                        item
                        xs={12 / Object.keys(analysis).length}
                      >
                        <Stack spacing={1}>
                          <Typography
                            variant='h6'
                            sx={{
                              position: 'sticky',
                              top: 0,
                              color: WHITE,
                            }}
                          >
                            {capitalizeFirstLetters(type)}
                          </Typography>
                          <Divider color={WHITE} sx={{ width: '8vw' }} />

                          {Object.entries(terms).map(([term, details]) => {
                            return (
                              <List key={`${language}-${type}-${term}-list`}>
                                <ListItemText>
                                  <Typography
                                    variant='body1'
                                    key={`${language}-${type}-${term}`}
                                  >
                                    <span style={{ color: ERROR }}>{term}</span>{' '}
                                    occurred{' '}
                                    {details.occurrences > 1
                                      ? `${details.occurrences} times`
                                      : 'once'}{' '}
                                    {details.files.length > 1
                                      ? `in ${details.files.length} files`
                                      : null}
                                  </Typography>
                                </ListItemText>
                                <Divider color={WHITE} sx={{ width: '8vw' }} />
                              </List>
                            );
                          })}
                        </Stack>
                      </Grid>
                    );
                  })}
                </Grid>
              </Stack>
            </Grid>
          );
        })}
      </Grid>
      <Dialog
        open={showRefactorModal}
        onClose={() => {
          setShowRefactorModal(false);
        }}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 0,
          },
        }}
      >
        <RefactorDialogComponent
          language={refactorLanguage}
          codeAnalysis={repoCodeAnalysis[refactorLanguage]}
          handleSetShowModal={wrapperSetShowRefactorModal}
        ></RefactorDialogComponent>
      </Dialog>
    </>
  );
}

export default CodebaseAnalysisComponent;
