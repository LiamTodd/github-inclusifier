import { Grid, Stack, Typography } from '@mui/material';
import { WHITE } from '../constants';
import { CodeListItem } from './helpers/codeListItem';

function CommentCodeComponent({ comments }) {
  return (
    <Grid item xs={4}>
      <Stack spacing={2}>
        <Typography variant='h5'>Comments</Typography>
        {comments.map((comment) => {
          const color = WHITE;
          return (
            <CodeListItem key={`variable-${comment}`} color={color}>
              {comment}
            </CodeListItem>
          );
        })}
      </Stack>
    </Grid>
  );
}

export default CommentCodeComponent;
