import { BLACK } from '../../constants';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

export const CodeListItem = styled(Paper)(({ color }) => ({
  backgroundColor: BLACK,
  padding: '2vh',
  color: color,
  fontFamily: 'Courier New',
}));
