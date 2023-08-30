import { Grid, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { DARK_GREY, ERROR, WHITE } from '../constants';
import { capitalizeFirstLetters } from '../utils/stringUtils';

function CodebaseAnalysisComponent({ repoCodeAnalysis }) {
  Object.entries(repoCodeAnalysis).forEach((language) => {
    console.log(language);
  });
  return (
    <Grid container spacing={2} sx={{ border: '1px solid white' }}>
      {Object.entries(repoCodeAnalysis).map(([language, analysis]) => {
        return (
          <Grid
            item
            xs={12 / Object.keys(repoCodeAnalysis).length}
            sx={{ border: '1px solid white' }}
          >
            <Stack spacing={2} sx={{ border: '1px solid white' }}>
              <Typography
                variant='h5'
                sx={{
                  position: 'sticky',
                  top: 0,
                  color: WHITE,
                  backgroundColor: DARK_GREY,
                  padding: '1vh',
                }}
              >
                {capitalizeFirstLetters(language)}
              </Typography>
              <Grid container sx={{ border: '1px solid white' }}>
                {Object.entries(analysis).map(([type, terms]) => {
                  return (
                    <Grid item xs={12 / Object.keys(analysis).length}>
                      <Stack spacing={1} sx={{ border: '1px solid white' }}>
                        <Typography
                          variant='h6'
                          sx={{
                            position: 'sticky',
                            top: 0,
                            color: WHITE,
                            backgroundColor: DARK_GREY,
                            padding: '1vh',
                          }}
                        >
                          {capitalizeFirstLetters(type)}
                        </Typography>
                        {Object.entries(terms).map(([term, details]) => {
                          return (
                            <Typography variant='body1'>
                              '<span style={{ color: ERROR }}>{term}</span>'
                              occurred{' '}
                              {details.occurrences > 1
                                ? `${details.occurrences} times`
                                : 'once'}{' '}
                              {details.files.length > 1
                                ? `in ${details.files.length} files`
                                : null}
                            </Typography>
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
  );
}

export default CodebaseAnalysisComponent;
