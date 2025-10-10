const {Router}= require('express');
const productManager= require('../managers/ProductManager');
const pm= new productManager('data/products.json');
const router= Router();

router.get("/", async (req,res)=>{
    try {
        const products= await pm.readAll();
        res.json(products);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

router.get("/:pid", async (req,res)=>{
    try {
        const product= await pm.getProductsById(req.params.pid);
        if (!product) return res.status(404).json({error: "producto no encontrado"});
        res.json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

router.post("/", async (req,res)=>{
    try{
        let {name,price,oferta,stock}= req.body;
        if(!name||price==null||oferta==null||stock==null){
            throw new Error("Todos los campos son obligatorios");
        }
        const product= await pm.addProduct(req.body);

        const io=req.app.get('io');
        io.emit('products', await pm.readAll());

        res.status(201).json({message:"producto agregado", product});

    } catch(e){
        res.status(500).json({ error: e.message });
    }
})

router.delete("/:pid", async (req,res)=>{
    try {
        const result= await pm.deleteProduct(Number(req.params.pid));
        if(!result) return res.status(404).json({error:"producto no encontrado"});

        const io=req.app.get('io');
        io.emit('products', await pm.readAll());

        res.json({message:"producto eliminado", result});
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})
module.exports = router;