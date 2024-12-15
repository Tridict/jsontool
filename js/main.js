// import { reactive, readonly, toRefs, computed, onMounted, onUpdated } from 'vue';
const { reactive, readonly, ref, toRefs, computed, onMounted, onUpdated } = Vue;

const MainApp = {
  setup() {

    const data = reactive({
      appName: "JsonTool",
      fields: [],
      storeEnabled: true,
      uuidSting: "",
      //
      "files": [],
      "dic": {},
      //
      "status": {
        tab: 1,
        minLen: 2,
        maxLen: 5,
        minFreq: 10,
        maxFreq: -1,
        searchPattern: "",
        searchWindow: 20,
        running: false,
        goon: true,
      },
      "ready": false,
      "settings": {
        dark_mode: false,
      },
      //
      "encodings": ["utf-8", "GBK"],
      //
    });

    const makeUuid = () => {data.uuidSting = uuid();};


    const theStore = reactive(BaseStore(data));
    const theSaver = readonly(BaseSaver(data));
    const theAlert = reactive(BaseAlert());
    // const theAlert = (() => {
    //   const data = reactive({
    //     lastIdx: 1,
    //     alerts: [],
    //   });
    //   const methods = {
    //     pushAlert(ctt = "🐵", typ = "info", tot = 2000) {
    //       console.log(['pushAlert', ctt, typ, tot]);
    //       let idx = data.lastIdx + 1;
    //       data.alerts.push({
    //         'idx': idx,
    //         'type': typ,
    //         'content': ctt,
    //         'show': 1,
    //       });
    //       data.lastIdx += 1;
    //       // let that = self;
    //       setTimeout(() => {
    //         methods.removeAlert(idx);
    //       }, tot);
    //     },
    //     removeAlert(idx) {
    //       data.alerts.find(alert => alert.idx == idx).show = 0;
    //     },
    //   };
    //   return { ...toRefs(data), ...methods };
    // })();
    const theReader = TheReader(theAlert.pushAlert);

    const dark_mode = computed(() => {
      return data.settings.dark_mode;
    });

    const deleteFile = (file) => {
      file.isUsable = false;
      data.files = data.files.filter(x => x.isUsable);
      data.files.forEach(x => x.readed = false);
    };



    const judgeFileKind = (content) => {
      let kind = 'PlainText';
      try {
        JSON.parse(content);
        kind = 'Json';
        return kind;
      } catch (error) {
        try {
          content.replace(/\r/g, '').split(/\n/).filter(t=>t?.length).map(y=>JSON.parse(y));
          kind = 'JsonLines';
          return kind;
        } catch (error) {
          kind = 'PlainText';
          return kind;
        };
      };
    }

    const updateFileKind = (file) => {
      if (file.kind==null||file.kind=="Any") {
        file.kind = judgeFileKind(file.content);
      };
    }

    const onImport = async (fileList, kind) => {
      let self = data;
      //
      for (let file of fileList) {
        if (self.files.map(f => f.name).includes(file.name)) {
          theAlert.pushAlert(`文件【${file.name}】重复。`)
        } else {
          let fileWrap = {};
          fileWrap.file = file;
          fileWrap.name = file.name;
          fileWrap.isUsable = true;
          fileWrap.readed = false;
          fileWrap.readed2 = false;
          fileWrap.tmp = false;
          fileWrap.encodingGot = false;
          fileWrap.encoding = null;
          fileWrap.kind = kind ?? 'Any';
          self.files.push(fileWrap);
          // self.readFile(file);
        }
      };
      for (let fileWrap of self.files) {
        if (!fileWrap.readed) {
          try {
            theReader.readFileAsBinaryString(fileWrap, fileWrap.encoding);
            await theReader.readFile(fileWrap);
            updateFileKind(fileWrap);
          } catch (error) {
            theAlert.pushAlert(error, 'warning', 5000);
          };
        }
      };
    };



    const onImportAny = async () => {
      let fileList = document.forms["file-form-0"]["file-input-0"].files;
      let result = await onImport(fileList);
      return result;
    }

    const onDropFile = async (event) => {
      event.stopPropagation();
      event.preventDefault();
      let fileList = event.dataTransfer.files;
      let result = await onImport(fileList);
      return result;
    }


    const dropArea = ref(null);
    onMounted(() => {
      // alert("mounted");
      data.ready = false;
      try {
        if (store.enabled) {
          data.storeEnabled = true;
          theStore.load(); //
          theAlert.lastIdx = 1;
          theAlert.alerts = [];
          theAlert.pushAlert(`您好！`, 'success', 3000);
        } else {
          data.storeEnabled = false;
          theAlert.lastIdx = 1;
          theAlert.alerts = [];
          theAlert.pushAlert(`您的浏览器不支持存储功能，请关闭隐私模式，或使用更加现代的浏览器！`, 'warning', 3000);
        };
        //
        data.status.running = false;
        data.status.goon = true;
        data.ready = true;
        //
      } catch (error) {
        console.log(error);
        theAlert.pushAlert(error, 'warning', 5000);
      };

      dropArea?.value?.addEventListener?.('dragenter', (event) => {
        onDropFile(event);
      });
      dropArea?.value?.addEventListener?.('dragover', (event) => {
        onDropFile(event);
      });
      dropArea?.value?.addEventListener?.('drop', (event) => {
        onDropFile(event);
      });

    });

    onUpdated(() => {
      theStore.save();
    });

    const save = (obj, fileName) => {
      theSaver.save(obj, fileName);
    };

    const saveText = (obj, fileName) => {
      theSaver.saveText(obj, fileName);
    };

    const saveJson5 = (obj, fileName) => {
      theSaver.saveJson5(obj, fileName);
    };

    const saveLines = (obj, fileName) => {
      theSaver.saveLines(obj, fileName);
    };

    const fs = () => {
      const result = data.files.map(xx=>{
        if (xx.kind==null||xx.kind=="Any") {
          xx.kind = judgeFileKind(xx.content);
        };
        return xx.kind=='Json' ? JSON.parse(xx.content):
        xx.kind=='JsonLines' ? (xx.content.replace(/\r/g, '').split(/\n/).filter(t=>t?.length).map(y=>JSON.parse(y))):
        xx.kind=='PlainText' ? (xx.content.replace(/\r/g, '').split(/\n/)):
        xx.content;
      });
      return result;
    };

    const fileNames = () => {
      const result = data.files.map(xx=>{
        return xx.name;
      });
      return result;
    };
    const filenames = fileNames;

    const log = console.log;
    const print = console.log;

    window.log = log;
    window.print = print;

    const JsTool = {
      __KV__: {},
      __History__: [],
      log(xxx) {
        const ttt = JSON.stringify(xxx);
        this.__History__.push(ttt);
        console.log(ttt);
      },
      clear() {
        this.__KV__ = {};
        this.__History__ = [];
      },
      set(kk, vv) { this.__KV__[kk] = vv; },
      get(kk) { return this.__KV__[kk]; },
      last() { return this.__History__[this.__History__.length - 1]; },
    };
    window.JsTool = JsTool;
    const runCode = (code) => {
      code = code.replace(/^【JsTool call】/g, '');
      code = code.replace(/【JsTool end】$/g, '');
      code = code.trim();
      try {
        eval(code);
      } catch (error) {
        JsTool.log(error);
      }
      return JsTool.last();
    };
    window.runCode = runCode;

    return {
      ...toRefs(data), makeUuid, theAlert, theStore, theSaver, theReader, deleteFile,
      onImportAny,
      save, saveText, saveJson5, saveLines, fs, log, print,
      fileNames, filenames,
    };
  },
};

const theApp = Vue.createApp(MainApp);
const app = theApp.mount('#app');
const fs = app.fs;
const save = app.save;
const saveText = app.saveText;
const saveJson5 = app.saveJson5;
const saveLines = app.saveLines;
const fileNames = app.fileNames;
const filenames = app.filenames;
