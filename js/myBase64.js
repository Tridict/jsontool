const MyBase64 = class MyBase64 {
  static myBase64Chars = "0123456789 ABCDEFG HIJKLMN OPQRST UVWXYZ abcdefg hijklmn opqrst uvwxyz -_".replaceAll(/\s+/g, "");
  static booleansToMyBase64(booleans, base64Chars=MyBase64.myBase64Chars) {
    let myBase64 = "";
    // 为什么从-1到booleans.length？
    // 是为了用两个true分别在首尾来包裹原有的booleans，并在末尾补上合适数量的false，使得booleans的长度是6的倍数
    let myBase64Index = 0;
    let j = 6;
    // let chunk = [];

    const oneStep = (bl_)=>{
      myBase64Index += bl_ ? Math.pow(2, j-1) : 0;
      // chunk.push(bl_);
      if (j==1) {
        // console.log(myBase64Index, base64Chars[myBase64Index]);
        myBase64 += base64Chars[myBase64Index];
        myBase64Index = 0;
        j=7;
        // // console.log(`${chunk}`);
        // chunk = [];
      }
      j--;
    };
    oneStep(true);  // 开头加一个true
    for (const bl of booleans) {
      oneStep(bl);
    }
    oneStep(true);  // 结尾加一个true


    // for (let i = 0; i <= (booleans.length+1); i ++) {

    //   if (i==0||i==(booleans.length+1)) {
    //     myBase64Index += Math.pow(2, j-1);  // 用两个true分别在首尾来包裹原有的booleans
    //     // chunk.push(true);
    //   } else {
    //     myBase64Index += booleans[i-1] ? Math.pow(2, j-1) : 0;
    //     // chunk.push(booleans[i-1]);
    //   }


    //   if (j==1) {
    //     // console.log(myBase64Index, base64Chars[myBase64Index]);
    //     myBase64 += base64Chars[myBase64Index];
    //     myBase64Index = 0;
    //     j=7;
    //     // // console.log(`${chunk}`);
    //     // chunk = [];
    //   }
    //   j--;
    // }

    // while (j>0) {
    //   // myBase64Index += 0;
    //   // chunk.push(false);
    //   j--;
    // }
    if (myBase64Index>0) {
      // console.log(myBase64Index, base64Chars[myBase64Index]);
      myBase64 += base64Chars[myBase64Index];
      // // console.log(`${chunk}`);
      // chunk = [];
    }
    return myBase64;
  }
  static myBase64ToBooleans(myBase64, base64Chars=MyBase64.myBase64Chars) {
    const booleans = [];
    let chunk = [];
    for (let i = 0; i < myBase64.length; i++) {
      let myBase64Rest = base64Chars.indexOf(myBase64[i]);
      // console.log(myBase64[i], myBase64Rest);
      for (let j = 1; j <= 6; j++) {
        chunk.push(myBase64Rest % 2 == 1);
        myBase64Rest = Math.floor(myBase64Rest / 2);
      }
      // console.log(`${chunk}`);
      booleans.push(...chunk.reverse());
      chunk = [];
    }
    // 为什么要去掉末尾的false？
    // 是因为在booleansToMyBase64中，为了使得booleans的长度是6的倍数，末尾补上了合适数量的false
    while (!booleans[booleans.length-1]) {booleans.pop();}
    // 为什么要去掉开头和结尾的true？
    // 是因为在booleansToMyBase64中，为了使得booleans的长度是6的倍数，用两个true分别在首尾来包裹原有的booleans
    booleans.pop();
    booleans.shift();
    return booleans;
  }
  static biStrToMyBase64(biStr, base64Chars=MyBase64.myBase64Chars) {
    return MyBase64.booleansToMyBase64(biStr.split("").map((c)=>c=="1"), base64Chars);
  }
  static myBase64ToBiStr(myBase64, base64Chars=MyBase64.myBase64Chars) {
    return MyBase64.myBase64ToBooleans(myBase64, base64Chars).map((b)=>b?"1":"0").join("");
  }
};

// // use cases

// // case 1
// var booleans = [true, false, true, false, true, false, true, false, true, false, true, false];
// var myBase64 = MyBase64.booleansToMyBase64(booleans);
// console.log(myBase64); // "rLG"

// // case 2
// var myBase64 = "rLG";
// var booleans = MyBase64.myBase64ToBooleans(myBase64);
// console.log(booleans); // [true, false, true, false, true, false, true, false, true, false, true, false]

// // case 3
// var biStr = "00101001010";
// var myBase64 = MyBase64.biStrToMyBase64(biStr);
// console.log(myBase64); // "bAW"

// // case 4
// var myBase64 = "bAW";
// var biStr = MyBase64.myBase64ToBiStr(myBase64);
// console.log(biStr); // "00101001010"

