import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { DARK_GREY, ERROR, LIGHT_PURPLE, WHITE } from '../constants';
import { capitalizeFirstLetters } from '../utils/stringUtils';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

function RefactorDialogComponent({
  language,
  handleSetShowModal,
  codeAnalysis,
}) {
  const [refactors, setRefactors] = useState({
    functions: [],
    variables: [],
    classes: [],
  });
  const [formReady, setFormReady] = useState(false);

  const handleRenameChange = (newValue, term, type, index) => {
    const updatedValues = { ...refactors };
    if (newValue) {
      updatedValues[type][index] = {
        newName: newValue,
        oldName: term,
        type: type,
      };
    } else {
      updatedValues[type].pop(index);
    }

    setRefactors(updatedValues);
  };

  useEffect(() => {
    let allEmpty = true;
    for (const list of Object.values(refactors)) {
      if (list.length > 0) {
        allEmpty = false;
        break;
      }
    }
    setFormReady(!allEmpty);
  }, [refactors]);

  const handleConfirm = () => {
    console.log('..refactoring');
  };

  return (
    <Box sx={{ backgroundColor: DARK_GREY, color: WHITE }}>
      <DialogTitle>Refactor {language} code</DialogTitle>
      <DialogContent>
        {Object.entries(codeAnalysis).map(([type, terms]) => {
          return (
            <>
              <Typography
                sx={{
                  color: WHITE,
                }}
              >
                {capitalizeFirstLetters(type)}
              </Typography>
              <Divider color={WHITE} />
              {Object.keys(terms).map((term, index) => {
                return (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1vh',
                    }}
                  >
                    <span style={{ color: ERROR }}>{term}</span>
                    <KeyboardDoubleArrowRightIcon />
                    <TextField
                      sx={{
                        input: { color: WHITE },
                      }}
                      InputProps={{
                        sx: {
                          '&:focus-within fieldset, &:focus-visible fieldset': {
                            borderColor: `${LIGHT_PURPLE}!important`,
                          },
                        },
                      }}
                      InputLabelProps={{
                        style: {
                          color: WHITE,
                        },
                      }}
                      FormHelperTextProps={{
                        sx: {
                          color: ERROR,
                        },
                      }}
                      placeholder='New name'
                      onChange={(e) => {
                        handleRenameChange(e.target.value, term, type, index);
                      }}
                    />
                  </Box>
                );
              })}
            </>
          );
        })}
      </DialogContent>

      <DialogActions sx={{ color: LIGHT_PURPLE }}>
        <Button
          sx={{ color: 'inherit' }}
          onClick={() => {
            handleSetShowModal(false);
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

export default RefactorDialogComponent;
