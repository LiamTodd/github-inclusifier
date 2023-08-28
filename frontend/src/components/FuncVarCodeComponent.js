import { Grid, Stack, Typography } from '@mui/material';
import { ERROR, WHITE } from '../constants';
import { CodeListItem } from './helpers/codeListItem';
import { capitalizeFirstLetters } from '../utils/stringUtils';

function FuncVarCodeComponent({ elements }) {
  return (
    <Grid item xs={4}>
      <Stack spacing={2}>
        <Typography variant='h5'>Variables</Typography>
        {elements.map((element) => {
          const color = element.non_inclusive ? ERROR : WHITE;
          return (
            <CodeListItem
              key={`variable-${element.term}`}
              sx={{
                color: { color },
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              {element.term}{' '}
              {element.non_inclusive
                ? `(${capitalizeFirstLetters(element.category)})`
                : null}
            </CodeListItem>
          );
        })}
      </Stack>
    </Grid>
  );
}

export default FuncVarCodeComponent;
