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



// 2022-03-14 ↓

const forceBlur = event => {
  let target = event.target;
  if (target.parentNode.className.split(/\s+/).includes("btn")) {
    target.blur();
    target = target.parentNode;
  }
  target.blur();
};

const timeString = () => {
  let the_date = new Date();
  let str = `${(''+the_date.getFullYear()).slice(2,4)}${(''+(the_date.getMonth()+1)).length==1?'0':''}${the_date.getMonth()+1}${(''+the_date.getDate()).length==1?'0':''}${the_date.getDate()}-${(''+the_date.getHours()).length==1?'0':''}${the_date.getHours()}${(''+the_date.getMinutes()).length==1?'0':''}${the_date.getMinutes()}${(''+the_date.getSeconds()).length==1?'0':''}${the_date.getSeconds()}`;
  return str;
};

const foolCopy = (it) => JSON.parse(JSON.stringify(it ?? null));

const uuid = () => {
  // Author: Abhishek Dutta, 12 June 2020
  // License: CC0 (https://creativecommons.org/choose/zero/)
   let temp_url = URL.createObjectURL(new Blob());
   let uuid_s = temp_url.toString();
   let uuid = uuid_s.substr(uuid_s.lastIndexOf('/') + 1);  // remove prefix (e.g. blob:null/, blob:www.test.com/, ...)
   URL.revokeObjectURL(temp_url);
   return uuid;
}

// 2022-03-14 ↑

