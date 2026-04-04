const productModel = require("../../models/productModel")

const getCategoryWiseProduct = async(req,res)=>{
    try{
        const { category } = req?.body || req?.query
        // console.log("category fetched from request", category)
        const product = await productModel.find({ category })
        // console.log("product category wise",product)

        res.json({
            data : product,
            message : "Product found successfully",
            success : true,
            error : false
        })
    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = getCategoryWiseProduct
