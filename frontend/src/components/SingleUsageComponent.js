import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Box,
} from '@mui/material';
import { DARK_GREY, ERROR, LIGHT_PURPLE, WBPM_NAME, WHITE } from '../constants';
import { useState } from 'react';

function SingleUsageComponent({
  sentence,
  algorithm,
  fileName,
  filePosition,
  sentencePosition,
  term,
}) {
  const [suggestedReplacement, setSuggestedReplacement] = useState();
  const [loading, setLoading] = useState(false);

  const handleSuggestChanges = () => {
    setLoading(true);
    setTimeout(() => {
      setSuggestedReplacement(`placeholder: ${sentence}`);
      setLoading(false);
    }, 5000);
  };
  return (
    <Card sx={{ width: 0.4, backgroundColor: DARK_GREY, color: WHITE }}>
      <CardContent>
        <Typography variant='body' fontStyle='italic' component='div'>
          "{sentence.slice(0, sentencePosition)}
          <span style={{ color: ERROR }}>
            {sentence.slice(sentencePosition, sentencePosition + term.length)}
          </span>
          {sentence.slice(sentencePosition + term.length)}"
        </Typography>
        <br />
        <Typography>
          {fileName}, position {filePosition}
          <br />
          Algorithm: {algorithm}
        </Typography>
        {loading ? (
          <Box
            sx={{
              color: LIGHT_PURPLE,
            }}
          >
            <CircularProgress color='inherit' size='3vw' />
          </Box>
        ) : suggestedReplacement ? (
          <>
            <br />
            <Typography variant='body' fontStyle='italic'>
              "{suggestedReplacement}"
            </Typography>
          </>
        ) : null}
      </CardContent>
      {algorithm === WBPM_NAME && (
        <CardActions>
          <Button onClick={handleSuggestChanges} sx={{ color: LIGHT_PURPLE }}>
            Suggest Changes
          </Button>
        </CardActions>
      )}
    </Card>
  );
}

export default SingleUsageComponent;
