const BaseSaver = () => {
  const methods = {
    saveText(text, fileName) {
      fileName = (!fileName?.length) ? "file.txt" : ((fileName?.split?.(".")?.length??0)<2) ? `${fileName}.txt` : fileName;
      let file = new File([text], fileName, {type: "text/plain;charset=utf-8"});
      saveAs(file);
    },
    save(obj, fileName) {
      fileName = (!fileName?.length) ? "file.json" : ((fileName?.split?.(".")?.length??0)<2) ? `${fileName}.json` : fileName;
      let text = JSON.stringify(obj, null, 2)
      let file = new File([text], fileName, {type: "text/plain;charset=utf-8"});
      saveAs(file);
    },
    saveLines(list, fileName) {
      if (list?.map==null) {list = [list]};
      fileName = (!fileName?.length) ? "file.jsonl" : ((fileName?.split?.(".")?.length??0)<2) ? `${fileName}.jsonl` : fileName;
      const lines = list.map(it=>JSON.stringify(it));
      let text = lines.join("\n");
      let file = new File([text], fileName, {type: "text/plain;charset=utf-8"});
      saveAs(file);
    },
  };
  return { ...methods };
};