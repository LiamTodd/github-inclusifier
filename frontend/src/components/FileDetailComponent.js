import { Box, Typography } from '@mui/material';
import {
  DARK_GREY,
  DETAIL_TABLE_COLUMNS,
  LIGHT_PURPLE,
  WHITE,
} from '../constants';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function FileDetailComponent({ fileData, handleSetSelectedTermData }) {
  const flaggedTerms = [];
  for (const category of [
    ...new Set([
      ...Object.keys(fileData.sspm_matches),
      ...Object.keys(fileData.wbpm_matches),
    ]),
  ]) {
    for (const term of Object.keys(fileData.sspm_matches[category])) {
      if (term) {
        const SSPMOccurrences = fileData.sspm_matches[category][term]
          ? fileData.sspm_matches[category][term].length
          : 0;
        const WBPMOccurrences = fileData.wbpm_matches[category][term]
          ? fileData.wbpm_matches[category][term].length
          : 0;
        flaggedTerms.push({
          category: category
            .charAt(0)
            .toUpperCase()
            .concat(category.slice(1).toLocaleLowerCase()),
          rawCategory: category,
          term: term,
          SSPMOccurrences: SSPMOccurrences - WBPMOccurrences, // because every wbpm occcurrence is also an sspm occurence
          WBPMOccurrences: WBPMOccurrences,
        });
      }
    }
  }

  return (
    <>
      <Box>
        <TableContainer sx={{ backgroundColor: DARK_GREY, color: WHITE }}>
          <Table aria-label='simple table'>
            <TableHead>
              <TableRow>
                {DETAIL_TABLE_COLUMNS.map((column, index) => {
                  return (
                    <TableCell
                      key={column.headerName}
                      align={index === 0 ? 'left' : 'right'}
                      sx={{
                        color: WHITE,
                      }}
                    >
                      <Typography variant='h6'>{column.headerName}</Typography>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {flaggedTerms.map((item) => (
                <TableRow
                  key={`${item.category}-${item.term}`}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell
                    component='th'
                    scope='row'
                    onClick={() =>
                      handleSetSelectedTermData({
                        term: item.term,
                        category: item.rawCategory,
                      })
                    }
                  >
                    <Typography
                      variant='body1'
                      sx={{
                        color: WHITE,
                        '&:hover': {
                          color: LIGHT_PURPLE,
                          textDecoration: `underline ${LIGHT_PURPLE}`,
                        },
                        textDecoration: `underline ${WHITE}`,
                        cursor: 'pointer',
                      }}
                    >
                      {item.term}
                    </Typography>
                  </TableCell>
                  <TableCell align='right' sx={{ color: WHITE }}>
                    <Typography>{item.category}</Typography>
                  </TableCell>
                  <TableCell align='right' sx={{ color: WHITE }}>
                    <Typography>{item.SSPMOccurrences}</Typography>
                  </TableCell>
                  <TableCell align='right' sx={{ color: WHITE }}>
                    <Typography>{item.WBPMOccurrences}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default FileDetailComponent;
