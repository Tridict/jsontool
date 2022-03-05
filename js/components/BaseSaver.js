const BaseSaver = () => {
  const methods = {
    saveText(text, fileName) {
      fileName = (fileName==null) ? "file.txt" : fileName;
      let file = new File([text], fileName, {type: "text/plain;charset=utf-8"});
      saveAs(file);
    },
    save(obj, fileName) {
      fileName = (fileName==null) ? "file.json" : fileName;
      let text = JSON.stringify(obj, null, 2)
      let file = new File([text], fileName, {type: "text/plain;charset=utf-8"});
      saveAs(file);
    },
  };
  return { ...methods };
};