import { ERROR } from '../../constants';

export const colourCodedComment = (comment) => {
  const flags = [];
  for (const [category, terms] of Object.entries(comment.analysis)) {
    for (const [term, occurrences] of Object.entries(terms)) {
      for (const occurrence of occurrences) {
        flags.push({
          length: term.length,
          index: occurrence,
          category: category,
        });
      }
    }
  }
  flags.sort((a, b) => a.index - b.index);
  const segments = [];
  let segmentStart = 0;
  let segmentEnd = 0;
  for (const flag of flags) {
    if (segmentStart !== flag.index) {
      segments.push(<span>{comment.text.slice(segmentEnd, flag.index)}</span>);
    }
    segmentStart = flag.index;
    segmentEnd = segmentStart + flag.length;
    segments.push(
      <span style={{ color: ERROR }}>
        {comment.text.slice(segmentStart, segmentEnd)}
      </span>
    );
  }
  segments.push(
    <span>{comment.text.slice(segmentEnd, comment.text.length)}</span>
  );
  console.log(segments);
  return segments;
};
