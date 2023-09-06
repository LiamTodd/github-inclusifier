import { Grid, Stack, Typography } from '@mui/material';
import { DARK_GREY, ERROR, WHITE } from '../constants';
import { CodeListItem } from './helpers/codeListItem';
import { capitalizeFirstLetters } from '../utils/stringUtils';

function FuncVarCodeComponent({ elements, elementType, width }) {
  return (
    <Grid item xs={width}>
      <Stack spacing={2}>
        <Typography
          variant='h5'
          sx={{
            position: 'sticky',
            top: 0,
            backgroundColor: DARK_GREY,
            padding: '1vh',
          }}
        >
          {elementType}
        </Typography>
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
