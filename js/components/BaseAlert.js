const BaseAlert = () => {
  const data = reactive({
    lastIdx: 1,
    alerts: [],
  });
  const methods = {
    pushAlert(ctt = "🐵", typ = "info", tot = 2000) {
      console.log(['pushAlert', ctt, typ, tot]);
      let idx = data.lastIdx + 1;
      data.alerts.push({
        'idx': idx,
        'type': typ,
        'content': ctt,
        'show': 1,
      });
      data.lastIdx += 1;
      // let that = self;
      setTimeout(() => {
        methods.removeAlert(idx);
      }, tot);
    },
    removeAlert(idx) {
      data.alerts.find(alert => alert.idx == idx).show = 0;
    },
  };
  return { ...toRefs(data), ...methods };
};