const Category = require("../models/category");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
    console.log("create api running");
    const category = new Category(req.body);
    console.log(category);
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({ data });

    });
};


exports.categoryById = (req, res,next,id) => {
    console.log("category id")
    const category = new Category(req.body);
    console.log("category id"+category);
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: "category not found"
            });
        }
        req.category = category;
        console.log(req.category);
        next();
    });
};
exports.update = (req, res) => {
    console.log("update api running");
    id = req.params.categoryId;
    console.log(id)
    data = req.body;
    console.log(data);
    Category.findByIdAndUpdate(id, {...data},{ new: true }).then(() => {

        // console.log("update")
        res.json({
            data,
            success: true,
            message: " category update successfully"
        })
    })

}

exports.getAllCategory=(req,res)=>{
    console.log("getall category");
    Category.find({},{name:1}).then((data)=>{
        res.json({
            data:data
        })
    }).catch(()=>{
        res.json({
            message:"error while fetch all category"
        })
    })
}

exports.DeleteCategory = (req, res) => {
    id = req.params.categoryById;
    console.log(id);
    Category.findOneAndDelete(id).then((data) => {
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