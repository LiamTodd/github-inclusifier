import { Grid, Stack, Typography } from '@mui/material';
import { DARK_GREY, WHITE } from '../constants';
import { CodeListItem } from './helpers/codeListItem';
import { colourCodedComment } from './helpers/colourCodedComment';

function CommentCodeComponent({ comments, width }) {
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
          Comments
        </Typography>
        {comments.map((comment) => {
          const color = WHITE;
          return (
            <CodeListItem key={`variable-${comment.text}`} color={color}>
              {colourCodedComment(comment).map((section) => section)}
            </CodeListItem>
          );
        })}
      </Stack>
    </Grid>
  );
}

export default CommentCodeComponent;
