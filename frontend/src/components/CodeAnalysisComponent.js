function CodeAnalysisComponent({ languageMode, selectedFileData }) {
  return (
    <>
      <h1>{languageMode}</h1>
      <pre>{selectedFileData.content}</pre>
    </>
  );
}

export default CodeAnalysisComponent;
