var fs = require("fs");
//方法有2个返回值，一个是err，一个是存储所有文件夹名称的数组
exports.getAllAlbums = function(callback){
    fs.readdir("./albums",function(err,files){
        if(err){
            callback("找不到albums",null);
            return;
        }
        var allAlbums = [];
        (function iterator(i){
            if(i==files.length){
                //遍历结束
                console.log(allAlbums);
                callback(null,allAlbums);
                return;
            }
            fs.stat("./albums/"+files[i],function(err,stats){
                if(err){
                    callback("找不到文件"+files[i],null);
                    return;
                }
                if(stats.isDirectory()){
                    allAlbums.push(files[i]);
                }
                iterator(i+1);
            })
        })(0);
    })
};

exports.getImagesByAlbumName = function(albumName,callback){
    fs.readdir("./albums/"+albumName,function(err,files){
        if(err){
            callback("找不到"+albumName,null);
            return;
        }
        var images = [];
        (function iterator(i){
            if(i==files.length){
                console.log(images);
                callback(null,images);
                return;
            }
            fs.stat("./albums/"+albumName+"/"+files[i],function(err,stats){
                if(err){
                    callback("找不到"+files[i],null);
                    return;
                }
                if(stats.isFile()){
                    images.push(files[i]);
                }
                iterator(i+1);
            })
        })(0);
    })
};
exports.createAlbum = function(albumName,callback){
    fs.mkdir("./albums/"+albumName,function(err){
        console.log(__dirname);
        console.log(albumName);
        if(err){
            callback("创建相册失败！")
            return;
        }
        callback(null);
        return;
    })
}