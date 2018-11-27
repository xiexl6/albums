var fs = require("fs");
fs.mkdir(__dirname+"/albums/"+"小妹",function(err){
    if(err){
        console.log(err);
    }
    console.log("创建成功")
})