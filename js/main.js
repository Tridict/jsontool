// import { reactive, readonly, toRefs, computed, onMounted, onUpdated } from 'vue';
const { reactive, readonly, toRefs, computed, onMounted, onUpdated } = Vue;

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
          fileWrap.kind = kind;
          self.files.push(fileWrap);
          // self.readFile(file);
        }
      };
      for (let fileWrap of self.files) {
        if (!fileWrap.readed) {
          theReader.readFileAsBinaryString(fileWrap, fileWrap.encoding)
            .then(() => {
              theReader.readFile(fileWrap);
            })
            .catch((error) => {
              theAlert.pushAlert(error, 'warning', 5000);
            });
        }
      };
    };



    const onImportJson = async () => {
      let fileList = document.forms["file-form-1"]["file-input-1"].files;
      let result = await onImport(fileList, "Json");
      return result;
    };



    const onImportJsonLines = async () => {
      let fileList = document.forms["file-form-2"]["file-input-2"].files;
      let result = await onImport(fileList, "JsonLines");
      return result;
    };



    const onImportTxt = async () => {
      let fileList = document.forms["file-form-3"]["file-input-3"].files;
      let result = await onImport(fileList, "PlainText");
      return result;
    };


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

    const fs = () => {
      return data.files.map(x=>
        x.kind=='Json' ? JSON.parse(x.content):
        x.kind=='JsonLines' ? (x.content.replace(/\r/g, '').split(/\n/).filter(t=>t?.length).map(y=>JSON.parse(y))):
        x.kind=='PlainText' ? (x.content.replace(/\r/g, '').split(/\n/)):
        x.content);
    };

    return { ...toRefs(data), makeUuid, theAlert, theStore, theSaver, theReader, deleteFile, onImportJson, onImportJsonLines, onImportTxt, save, saveText, fs };
  },
};

const theApp = Vue.createApp(MainApp);
const app = theApp.mount('#app');
