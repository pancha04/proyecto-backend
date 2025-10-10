const {Router}=require('express');
const router= Router();
const ProductManager= require('../managers/ProductManager');
const pm= new ProductManager('data/products.json');

router.get("/", async(req,res)=>{
    try {
        const products = await pm.readAll();
        res.render('home', { products });
    } catch (error) {
        res.status(500).send("Error al cargar productos: " + error.message);
    }
})

router.get("/realTimeProducts",async (req,res)=>{
    const products= await pm.readAll()
    res.render('realTimeProducts',{products});
})

module.exports= router;