import { Box } from '@mui/material';
import SingleUsageComponent from './SingleUsageComponent';
import {
  extractIndexOfSentence,
  extractSentenceAtIndex,
} from '../utils/stringUtils';
import { BLACK, SSPM_NAME, WBPM_NAME } from '../constants';

function TermSuggestionsComponent({ selectedFileData, selectedTermData }) {
  console.log(selectedFileData);
  const wbpmUsages =
    selectedFileData.wbpm_matches[selectedTermData.category][
      selectedTermData.term
    ] || [];

  const sspmUsages =
    selectedFileData.sspm_matches[selectedTermData.category][
      selectedTermData.term
    ].filter((element) => !wbpmUsages.includes(element)) ||
    selectedFileData.sspm_matches[selectedTermData.category][
      selectedTermData.term
    ];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: BLACK,
        width: 1,
        height: 1,
      }}
    >
      {wbpmUsages.map((index) => {
        return (
          <SingleUsageComponent
            sentence={extractSentenceAtIndex(selectedFileData.content, index)}
            algorithm={WBPM_NAME}
            fileName={selectedFileData.file_name}
            filePosition={index}
            sentencePosition={extractIndexOfSentence(
              selectedFileData.content,
              index
            )}
            term={selectedTermData.term}
            key={`${selectedFileData.file_name}-${selectedTermData.term}-${WBPM_NAME}-${index}`}
          ></SingleUsageComponent>
        );
      })}
      {sspmUsages.map((index) => {
        return (
          <SingleUsageComponent
            sentence={extractSentenceAtIndex(selectedFileData.content, index)}
            algorithm={SSPM_NAME}
            fileName={selectedFileData.file_name}
            filePosition={index}
            term={selectedTermData.term}
            sentencePosition={extractIndexOfSentence(
              selectedFileData.content,
              index
            )}
            key={`${selectedFileData.file_name}-${selectedTermData.term}-${SSPM_NAME}-${index}`}
          ></SingleUsageComponent>
        );
      })}
    </Box>
  );
}

export default TermSuggestionsComponent;
