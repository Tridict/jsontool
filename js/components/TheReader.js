
const TheReader = (handleError=console.log) => {

  const {
    reader_ReadFileAsText,
    reader_ReadFileAsArrayBuffer,
    reader_ReadFileAsBinaryString,
  } = BaseReader();

  const methods = {
    readFileAsArrayBuffer: async function(fileWrap) {
      let file_content = null;
      await reader_ReadFileAsArrayBuffer(fileWrap.file)
        .then((reader) => {
          console.log(reader.result);
          fileWrap.readed2 = true;
          fileWrap.buffer = reader.result;
        })
        .catch((error) => {
          handleError(error);
        });
    },
    readFileAsBinaryString: async function(fileWrap, encoding) {
      let file_content = null;
      await reader_ReadFileAsBinaryString(fileWrap.file)
        .then((reader) => {
          // console.log(reader.result);
          fileWrap.tmp = true;
          fileWrap.test = reader.result.slice(0, 300);
          return fileWrap;
          // jschardet.detect(the_vue.files[0].buinaryString.slice(0,100));
        })
        .then((fileWrap) => {
          if (encoding==null) {
            encoding = jschardet.detect(fileWrap.test).encoding;
            encoding = encoding== "ascii" ? "utf-8" : encoding;
          };
          return [encoding, fileWrap];
        })
        .then(([encoding, fileWrap]) => {
          fileWrap.encoding = encoding;
          fileWrap.encodingGot = true;
          return fileWrap;
        })
        .catch(({
          error
        }) => {
          handleError(error);
        });
    },
    readFile: async function(fileWrap) {
      let file_content = null;
      await reader_ReadFileAsText(fileWrap)
        .then((reader) => {
          console.log(reader.result);
          fileWrap.content = reader.result;
          fileWrap.readed = true;
        })
        .catch((error) => {
          handleError(error);
        });
    },

  };

  return { ...methods };
};
