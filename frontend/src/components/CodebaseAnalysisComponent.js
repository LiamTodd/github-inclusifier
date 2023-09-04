import {
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { BLACK, DARK_GREY, ERROR, WHITE } from '../constants';
import { capitalizeFirstLetters } from '../utils/stringUtils';

function CodebaseAnalysisComponent({ repoCodeAnalysis }) {
  console.log(repoCodeAnalysis);
  return (
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
                {capitalizeFirstLetters(language)}
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
                        <Divider color={WHITE} sx={{ width: '10vw' }} />

                        {Object.entries(terms).map(([term, details]) => {
                          return (
                            <List>
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
                              <Divider color={WHITE} sx={{ width: '15vw' }} />
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
  );
}

export default CodebaseAnalysisComponent;
