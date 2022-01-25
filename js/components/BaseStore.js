const BaseStore = (data_) => {
  if (data_ == null) {
    data_ = {
      appName: "____",
      fields: [],
      storeEnabled: true,
    };
  };
  const data = data_;
  const methods = {
    load() {
      for (let field of data.fields) {
        let it = store.get(`${data.appName}:${field}`);
        if (it) {
          data[field] = it;
        };
      };
    },
    save() {
      for (let field of data.fields) {
        store.set(`${data.appName}:${field}`, data[field]);
      };
    },
  };
  return { ...methods };
};