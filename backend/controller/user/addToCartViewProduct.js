const addToCartModel = require("../../models/cartProduct")

const addToCartViewProduct = async(req,res)=>{
    try{
        const currentUser = req.userId

        const allProduct = await addToCartModel.find({ userId : currentUser }).populate("productId")

        res.json({
            data : allProduct,
            success : true,
            error : false
        })
        // console.log("Cart allProduct",allProduct)

    }catch(err){
        // console.log("addToCartViewProduct api error",err)
        res.json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports =  addToCartViewProduct
