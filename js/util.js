// const vConsole = new VConsole();

const table2obj = (raw) => {
  let data = [];
  for (let i in raw) {
    if (i == 0) {
    } else {
      let obj = {};
      for (let x in raw[0]) {
        obj[raw[0][x]] = raw[i][x];
      }
      data.push(obj);
    };
  };
  return data;
};

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const staFreq = async function(dic, text, minW, maxW, status) {
  console.log(`staFreq(dic, text, ${minW}, ${maxW}, status)`);
  minW = +minW > 1 ? +minW : 1;
  maxW = +maxW > minW ? +maxW : minW;
  for (let ww = minW; ww <= maxW; ww++) {
    for (let ii = 0; ii <= text.length - ww; ii++) {
      if (status.goon && status.running) {
        let span = JSON.stringify(text.slice(ii, ii + ww));
        await sleep(0).then(() => {
          // console.log(`async ${ww}`);
          if (span in dic) {
            dic[span] += 1;
          } else {
            dic[span] = 1;
          };
        });
      } else {
        break;
      };
    };
  };
};
