import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  DARK_GREY,
  ERROR,
  LIGHT_PURPLE,
  MODEL_CHOICES,
  WHITE,
} from '../constants';

function ModelSelectorDialogContentComponent({
  handleSetShowModelSelector,
  handleSetLoading,
  handleSetSuggestedReplacement,
}) {
  const [selectedModel, setSelectedModel] = useState('');
  const [formReady, setFormReady] = useState(false);

  useEffect(() => {
    const allFilled = Boolean(selectedModel);
    setFormReady(allFilled);
  }, [selectedModel]);

  const handleSelectModel = (event) => {
    setSelectedModel(event.target.value);
  };

  const handleConfirm = () => {
    handleSetShowModelSelector(false);
    handleSetLoading(true);
    setTimeout(() => {
      handleSetSuggestedReplacement(`placeholder: ${selectedModel}`);
      handleSetLoading(false);
    }, 5000);
  };

  return (
    <Box sx={{ backgroundColor: DARK_GREY, color: WHITE }}>
      <DialogTitle>Select a Large Language Model</DialogTitle>
      <DialogContent>
        <DialogContentText component={'div'}>
          <FormControl fullWidth>
            <Select
              value={selectedModel}
              onChange={handleSelectModel}
              sx={{
                '& .MuiSvgIcon-root': {
                  color: WHITE,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: LIGHT_PURPLE,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: LIGHT_PURPLE,
                },
                color: WHITE,
              }}
            >
              {Object.keys(MODEL_CHOICES).map((model) => {
                return (
                  <MenuItem value={model} key={`choice-${model}`}>
                    {model}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </DialogContentText>
        {selectedModel && MODEL_CHOICES[selectedModel].customInput
          ? MODEL_CHOICES[selectedModel].customInput
          : null}
      </DialogContent>
      <DialogActions sx={{ color: LIGHT_PURPLE }}>
        <Button
          sx={{ color: 'inherit' }}
          onClick={() => {
            handleSetShowModelSelector(false);
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

export default ModelSelectorDialogContentComponent;
