const NanoID = (()=>{
  let random=async t=>crypto.getRandomValues(new Uint8Array(t));

  let customAlphabet=(a,t=21)=>{let o=(2<<Math.log(a.length-1)/Math.LN2)-1,l=-~(1.6*o*t/a.length);return async(e=t)=>{let n="";for(;;){var r=crypto.getRandomValues(new Uint8Array(l));let t=l;for(;t--;)if((n+=a[r[t]&o]||"").length===e)return n}}};

  let nanoid=async(e=21)=>{let n="";for(var r=crypto.getRandomValues(new Uint8Array(e));e--;){let t=63&r[e];t<36?n+=t.toString(36):t<62?n+=(t-26).toString(36).toUpperCase():t<63?n+="_":n+="-"}return n};

  return {random,customAlphabet,nanoid};
})();

const nanoid = NanoID.nanoid;

// export{random,customAlphabet,nanoid};
