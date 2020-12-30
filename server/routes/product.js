const express = require('express');
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

const { createProduct } = require('../controllers/product');
const { userById } = require('../controllers/user');
const { productById } = require("../controllers/product");
const { DeleteProduct } = require('../controllers/product');
const { updateProduct } = require('../controllers/product');
const { findProductByName } = require('../controllers/product');
const { findProductById } = require('../controllers/product');
const { findProductByCategory } = require('../controllers/product');
const { categoryById } = require('../controllers/category');

router.post('/product/create/:userId',requireSignin,isAuth,isAdmin,createProduct);
router.delete('/product/delete/:productId/:userId',requireSignin,isAuth,isAdmin,DeleteProduct);
router.put('/product/update/:productId/:userId',requireSignin,isAuth,isAdmin,updateProduct);
router.get('/product/findname',findProductByName);
router.get('/product/findId/:productId',findProductById);
router.post('/product/searchByName/:categoryId',findProductByCategory);

router.param("userId",userById);
router.param("productId",productById);
router.param('categoryId',categoryById);


module.exports=router;