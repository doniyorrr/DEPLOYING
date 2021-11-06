const { Router } = require("express");
const dbProduct = require("../model/product");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
// const fetch = require("node-fetch");
const router = Router();
// console.log(fetch)

router.get("/", (req, res) => {
  // console.log(fetch);
  
  dbProduct.find({}, (err, data) => {
    fetch("https://cbu.uz/oz/arkhiv-kursov-valyut/json/")
      .then((data) => data.json())
      .then((body) =>
        res.render("index", {
          title: "Bosh sahifa",
          datas: data,
          kurs : body,
        })
      );
  });
});

router.get("/search", (req, res) => {
  // console.log(req.query)
  let { search } = req.query;
  search.toLowerCase();
  dbProduct.find({ title: { $regex: search } }, (err, data) => {
    if (data == "") {
      res.redirect("/");
    } else {
      res.render("index", {
        title: "Bosh sahifa",
        datas: data,
      });
    }
  });
});




// router.post("/:id", (req, res) => {
//   dbProduct.findById(req.params.id, (err, data) => {
//     if (err) console.log(err);
//     else {
//       data.like += 1;
//       data.save();
//       res.send(data);
//     }
//   });
// });

// router.post("/", (req, res) => {
//   res.send("method of get");
// });

module.exports = router;
