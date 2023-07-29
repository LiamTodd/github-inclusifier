import { WHITE } from '../constants';

function FileDetailComponent({ fileData }) {
  return <pre>{fileData.content}</pre>;
}

export default FileDetailComponent;
