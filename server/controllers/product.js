const Product = require('../models/product');
const formidable = require('formidable');
const fs = require("fs");
const _ = require('lodash');
const errorHandler = require('../helpers/dbErrorHandler');

exports.productById = (req, res,next,id) => {
  console.log("product id")
  const product = new Product(req.body);
  console.log("product id"+product);
  Product.findById(id).exec((err, product) => {
      if (err || !product) {
          return res.status(400).json({
              error: "product not found"
          });
      }
      req.product = product;
      console.log(req.product);
      next();
  });
};

exports.getProductById = (req,res,id)=>{
  console.log('Get product by Id');
  //const product = req.body;
  //console.log(product)
  //const product = new Product(req.body);
  id = req.params.productById
  // console.log(id);
  Product.findById(id).then((err,product)=>{
      if(err){
          return res.status(401).json({
              error :"not found product"
          })
      }
      req.product = product;
      console.log(req.product)
      
      
  })
}

exports.findProductByName=(req,res)=>{
  console.log("getall product");
  Product.find({},{name:1}).then((data)=>{
    Product.photo = undefined;
      res.json({
          data:data
      })
  }).catch(()=>{
      res.json({
          message:"error while fetch all category"
      })
  })
}
exports.findProductById=(req,res,id)=>{
  console.log("getall product");
   id = req.body.productById;
  Product.findById(id).then((data)=>{
    Product.photo = undefined;
      res.json({
          data:data
      })
  }).catch(()=>{
      res.json({
          message:"error while fetch all category"
      })
  })
}

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
  
    form.parse(req, (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          error: "problem with image"
        });
      }
      //destructure the fields
      const { name, description,category, price, stock } = fields;
  
      if (!name || !description || !category || !price || !stock) {

        console.log(name);
        console.log(description);
        console.log(category);
        console.log(price);
        console.log(stock);

        return res.status(400).json({
          error: "Please include all fields"
        });
      }
  
      let product = new Product(fields);
      console.log(product);

      
      if (file.photo) {
        if (file.photo.size > 3000000) {
          return res.status(400).json({
            error: "File size too big!"
          });
        }
        product.photo.data = fs.readFileSync(file.photo.path);
        product.photo.contentType = file.photo.type;
      }
      product.photo = undefined;
      //save to the DB
      product.save((err, product) => {
        if (err) {
          res.status(400).json({
            error: "Saving tshirt in DB failed"
          });
        }
        res.json(product);
      });
    });
  };

  exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Image could not be uploaded",
        });
      }
      // check for all fields
      const { name, description, price, category,stock } = fields;
  
      if (!name || !description || !category || !price || !stock) {

        console.log(name);
        console.log(description);
        console.log(category);
        console.log(price);
        console.log(stock);

        return res.status(400).json({
          error: "All fields are required",
        });
      }
  
      let product = req.product;
      product = _.extend(product, fields);
  
      // 1kb = 1000
      // 1mb = 1000000
  
      if (files.photo) {
        // console.log("FILES PHOTO: ", files.photo);
        if (files.photo.size > 1000000) {
          return res.status(400).json({
            error: "Image should be less than 1mb in size",
          });
        }
        product.photo.data = fs.readFileSync(files.photo.path);
        product.photo.contentType = files.photo.type;
      }
  
      product.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(result);
      });
    });
  };

  exports.findProductByCategory=(req,res)=>{
    console.log("search by product name");
    const id = req.params.categoryId;
    console.log(id)
    Product.find({"category":id}).then((data)=>{
      res.json({data})
    }).catch(err=>{
      res.json({error : 'not found category and product'+err})
    })
    
}

  exports.DeleteProduct = (req, res,id) => {
    console.log("delete api is running");
    id = req.params.productById;
    console.log(id);
    Product.findOneAndDelete(id).then((data) => {
        res.json({
            data : data,
            success: true,
            message: "delete successfully"
        })
    }).catch(err => {
        res.json({
            message: "something went to wrong! " + err
        })
    })

}