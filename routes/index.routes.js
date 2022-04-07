const indexRouter = require("express").Router();
const path = require("path");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Story = require("../models/storyModel");

// const
// // set storage engine
// const storage = multer.diskStorage({
//   destination: "./public/img/",
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname +
//         "-" +
//         file.originalname.split(".")[0] +
//         "-" +
//         Date.now() +
//         path.extname(file.originalname)
//     );
//   },
// });

// const checkFileType = function (file, cb) {
//   // allowed file extension
//   const fileType = /jpeg|jpg|png|gif/;
//   // check ext
//   const extname = fileType.test(path.extname(file.originalname).toLowerCase());

//   // check mime
//   const mimetype = fileType.test(file.mimetype);

//   if (mimetype && fileType) {
//     return cb(null, true);
//   } else {
//     cb("Error:file should be type of image eg: jpg,jpeg,png");
//   }
// };

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 200000 },
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
// }).single("myimg");

indexRouter.get("/", ensureGuest, (req, res, next) => {
  res.render("login", { layout: "login.hbs" });
});

indexRouter.get("/dashboard", ensureAuth, async (req, res, next) => {
 
  try {
    const stories = await Story.find({ user: req.user._id }).lean();
    res.render("dashboard", {
      name: req.user.displayName,
      stories,
    });
  } catch (error) {
    console.log(error);
    res.render("error/500");
  }
});

// indexRouter.post('/upload',(req,res)=>{
//     upload(req,res,(err)=>{
//         if(err){
//             res.render('home',{
//                 msg:err
//             });
//         }else{
//             if(req.file==undefined){
//                 res.render('home',{
//                     msg:"please select the file!"
//                 })
//             }else{
//                 res.render('home',{
//                     msg:"file uploaded",
//                     file:`img/${req.file.filename}`
//                 })
//             }

//         }
//     })
//     console.log(req.body)
// })

module.exports = indexRouter;
