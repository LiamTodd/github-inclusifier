import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Box,
  Dialog,
} from '@mui/material';
import {
  BLACK,
  ERROR,
  LIGHT_PURPLE,
  SSPM_NAME,
  WBPM_NAME,
  WHITE,
} from '../constants';
import { useCallback, useState } from 'react';
import ModelSelectorDialogContentComponent from './ModelSelectorDialogContentComponent';

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
  const [showModelSelector, setShowModelSelector] = useState(false);
  const wrapperSetSuggestedReplacement = useCallback(
    (val) => setSuggestedReplacement(val),
    [setSuggestedReplacement]
  );
  const wrapperSetLoading = useCallback((val) => setLoading(val), [setLoading]);
  const wrapperSetShowModelSelector = useCallback(
    (val) => setShowModelSelector(val),
    [setShowModelSelector]
  );
  return (
    <Card
      sx={{
        backgroundColor: BLACK,
        color: WHITE,
        margin: '3vh',
      }}
    >
      <CardContent>
        <Typography variant='subtitle1'>Original Text</Typography>
        <Typography variant='body' fontStyle='italic' component='div'>
          "{sentence.slice(0, sentencePosition)}
          <span style={{ color: ERROR }}>
            {sentence.slice(sentencePosition, sentencePosition + term.length)}
          </span>
          {sentence.slice(sentencePosition + term.length)}"
        </Typography>
        <br />
        <Typography variant='caption'>
          {fileName}, character position {filePosition}
          <br />
          Algorithm: {algorithm}
          {algorithm === SSPM_NAME
            ? ' (suggested changes not available)'
            : null}
        </Typography>
        <br />
        <br />
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
            <Typography variant='subtitle1'>Suggested Changes</Typography>
            <Typography variant='body' fontStyle='italic'>
              "{suggestedReplacement}"
            </Typography>
          </>
        ) : null}
      </CardContent>
      {algorithm === WBPM_NAME && (
        <CardActions>
          <Button
            onClick={() => {
              setShowModelSelector(true);
            }}
            sx={{ color: LIGHT_PURPLE }}
          >
            Suggest Changes
          </Button>
          <Dialog
            open={showModelSelector}
            onClose={() => {
              setShowModelSelector(false);
            }}
            sx={{
              '& .MuiDialog-paper': {
                borderRadius: 0,
              },
            }}
          >
            <ModelSelectorDialogContentComponent
              originalText={sentence}
              handleSetShowModelSelector={wrapperSetShowModelSelector}
              handleSetLoading={wrapperSetLoading}
              handleSetSuggestedReplacement={wrapperSetSuggestedReplacement}
            />
          </Dialog>
        </CardActions>
      )}
    </Card>
  );
}

export default SingleUsageComponent;
