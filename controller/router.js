var file = require("../models/file");
var formidable = require("formidable");
var path = require("path");
var fs = require("fs");
var sd = require("silly-datetime");
exports.showIndex = function (req, res, next) {
    file.getAllAlbums(function (err, allAlbums) {
        if (err) {
            next();//交给下面适合他的中间件
            return;
        }
        res.render("index", {
            "albums": allAlbums
        })
    })
};
exports.showAlbum = function (req, res, next) {
    var albumName = req.params.albumName;
    file.getImagesByAlbumName(albumName, function (err, images) {
        if (err) {
            next();//交给下一个中间件
            return;
        }
        res.render("album", {
            "albumName": albumName,
            "images": images
        })
    })
};
exports.showUpForm = function (req, res) {
    file.getAllAlbums(function (err, albums) {
        res.render("upForm", {
            "albums": albums
        })
    })
};
exports.doUpForm = function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = path.normalize(__dirname + "/../tempup/");
    // form.maxFileSize = 716 * 1024 ;
    form.parse(req, function (err, fields, files, next) {
        console.log(fields);
        console.log(files);
        if(err){
            console.log(err);
            next();//交给其他中间件
            // res.send(err);
            return;
        }
        console.log(files.image.size);
        //判断图片大小
        
        var size = parseInt(files.image.size);
        if(size==0){
            res.send("请选择图片");
            return;
        }
        var dir = fields.dir;
        if(size>2*1024*1024){
            res.send("图片尺寸不能大于2M");
            fs.unlink(files.image.path,function(err){
                if(err){
                    res.send("删除文件失败");
                    return;
                }
            });
            return;
        }
        var date = sd.format(new Date(), 'YYYYMMDDHHmmss');
        var random = parseInt(Math.random()*89999+10000);
        var extName = path.extname(files.image.name);
        var oldPath = files.image.path;
        var newPath = path.normalize(__dirname+"/..///albums/"+dir+"/"+date+random+extName);
        fs.rename(oldPath,newPath,function(err){
            if(err){
                res.send("改名失败！");
                return;
            }
            res.send("上传成功");
        })
    });
    return;
};
exports.showCreateForm = function(req,res){
    res.render("createForm");
};
exports.doCreateAlbum = function(req,res,next){
    var albumName = "";
    var form = new formidable.IncomingForm();
    
    form.parse(req, function (err, fields, files, next) {
        console.log(fields);
        console.log(files);
        if(err){
            console.log(err);
            next();//交给其他中间件
            // res.send(err);
            return;
        }
        albumName = fields.albumName;
        console.log(albumName);
        file.createAlbum(albumName,function(err){
            if(err){
                console.log(err);
                res.send("创建相册失败");
                return;
            }
            res.send("创建相册成功");
        })
        return;
    })
    
}