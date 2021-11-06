const { Router } = require("express");
const dbProduct = require("../model/product");
const dbUser = require("../model/user");
const multer = require("../midleware/multer").single("photo"); 
const path = require("path");
const { send } = require("process");
const router = Router();

router.get("/product/add", (req, res) => {
  res.render("add", {
    title: "Mahsulot qoshish",
  });
});

router.post("/product/add", multer, (req, res) => {
  req.checkBody("title", "Mahsulot nomi bosh qolishi mumkin emas").notEmpty();
  req.checkBody("price", "Mahsulot price bosh qolishi mumkin emas").notEmpty();
  req
    .checkBody("category", "Mahsulot category bosh qolishi mumkin emas")
    .notEmpty();
  req
    .checkBody("comments", "Mahsulot comments bosh qolishi mumkin emas")
    .notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    res.render("add", {
      title: "Error",
      errors: errors,
    });
  } else {
    const db = new dbProduct({
      title: req.body.title.toLowerCase(),
      price: req.body.price,
      photo: req.file.path,
      category: req.body.category,
      dirUser: req.user.id,
      comments: req.body.comments,
      sale: req.body.sale,
    });
    db.save((err) => {
      if (err) throw err;
      else {
        req.flash("success", "Mahsulot qoshildi");
        res.redirect("/");
      }
    });
  }
});

router.get("/product/:id", async(req, res) => {
  let db = await dbProduct.find({})
  // console.log(req.params.id)
  dbProduct.findById(req.params.id, (err, data) => {
    // console.log(data)
    dbUser.findById(data.dirUser, (err, user) => {
      res.render("cards", {
        title: "Mahsulot haqida",
        datas: data,
        db,
        prof : user
      });
    });
  });
});

router.get("/product/edit/:userId", (req, res) => {
  dbProduct.findById(req.params.userId, (err, data) => {
    if(data.dirUser != req.user._id){
      req.flash("danger" , "bunaqa sahifa topilmadi")
      res.redirect("/")
    }
    else{
      res.render("add", {
      title: "Mahsulot ozgartirish",
      datas: data,
    });
    }
    
  });
});

router.get("/product/delete/:id", (req, res) => {
  if(!req.user.id){
    res.status(500).send()
  }
  let id = {_id : req.params.id}
  dbProduct.findById(req.params.id, (err, data) => {
    // console.log(err)
    // console.log(data)
    if(data.dirUser != req.user._id){
      req.flash("danger" , "bunaqa sahifa topilmadi")
      res.redirect("/")
    }
    else{
      dbProduct.findOneAndDelete(id , (err)=>{
        if(err) console.log(err)
        req.flash("success" , "maxsulot ochirildi")
        res.redirect("/")
      })
    }
    
  });
});

// router.get("/product/:id", (req, res) => {
//   dbProduct.findById(req.params.id, (err, data) => {
//     res.render("cards", {
//       title: "Mahsulot haqida",
//       datas: data,
//     });
//   });
// });

router.post("/product/edit/:userId", multer, (req, res) => {
  req.checkBody("title", "Mahsulot nomi bosh qolishi mumkin emas").notEmpty();
  req.checkBody("price", "Mahsulot price bosh qolishi mumkin emas").notEmpty();
  // req.checkBody("photo", "Mahsulot photo bosh qolishi mumkin emas").notEmpty();
  req
    .checkBody("category", "Mahsulot category bosh qolishi mumkin emas")
    .notEmpty();
  req
    .checkBody("comments", "Mahsulot comments bosh qolishi mumkin emas")
    .notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    res.render("add", {
      title: "Error",
      errors: errors,
    });
  } else {
    const db = {
      title: req.body.title.toLowerCase(),
      price: req.body.price,
      photo: req.file.path,
      category: req.body.category,
      comments: req.body.comments,
      sale: req.body.sale,
    };
    const ids = { _id: req.params.userId };
    dbProduct.updateOne(ids, db, (err) => {
      if (err) console.log(err);
      else {
        req.flash("success", "Mahsulot qoshildi");
        res.redirect("/");
      }
    });
  }
});

module.exports = router;
