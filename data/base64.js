// https://qiita.com/weal/items/1a2af81138cd8f49937d

const Base64 = {
    encode: (function(i, tbl) {
        for(i=0,tbl={64:61,63:47,62:43}; i<62; i++) {tbl[i]=i<26?i+65:(i<52?i+71:i-4);} //A-Za-z0-9+/=
        return function(arr) {
            var len, str, buf;
            if (!arr || !arr.length) {return "";}
            for(i=0,len=arr.length,buf=[],str=""; i<len; i+=3) { //6+2,4+4,2+6
                str += String.fromCharCode(
                    tbl[arr[i] >>> 2],
                    tbl[(arr[i]&3)<<4 | arr[i+1]>>>4],
                    tbl[i+1<len ? (arr[i+1]&15)<<2 | arr[i+2]>>>6 : 64],
                    tbl[i+2<len ? (arr[i+2]&63) : 64]
                );
            }
            return str;
        };
    }()),
    decode: (function(i, tbl) {
        for(i=0,tbl={61:64,47:63,43:62}; i<62; i++) {tbl[i<26?i+65:(i<52?i+71:i-4)]=i;} //A-Za-z0-9+/=
        return function(str) {
            var j, len, arr, buf;
            if (!str || !str.length) {return [];}
            for(i=0,len=str.length,arr=[],buf=[]; i<len; i+=4) { //6,2+4,4+2,6
                for(j=0; j<4; j++) {buf[j] = tbl[str.charCodeAt(i+j)||0];}
                arr.push(
                    buf[0]<<2|(buf[1]&63)>>>4,
                    (buf[1]&15)<<4|(buf[2]&63)>>>2,
                    (buf[2]&3)<<6|buf[3]&63
                );
            }
            if (buf[3]===64) {arr.pop();if (buf[2]===64) {arr.pop();}}
            return arr;
        };
    }())
};
