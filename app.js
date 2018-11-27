var express = require("express");
var app = express();
app.set("view engine","ejs");
var router = require("./controller");
app.use(express.static("./public"));
app.use(express.static("./albums"))
app.get("/",router.showIndex);
app.get("/:albumName",router.showAlbum);
app.get("/up",router.showUpForm);
app.get("/createAlbum",router.showCreateForm);
app.post("/createAlbum",router.doCreateAlbum);
app.post("/up",router.doUpForm);
app.use(function(req,res){
    res.render("err");
})
app.listen(80);