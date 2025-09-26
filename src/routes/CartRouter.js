const {Router}= require('express');
const CartManager= require('../managers/CartManager');
const cm= new CartManager('./carts.json');
const router= Router();

router.post("/", async(req,res)=>{
    try {
        const cart= await cm.createCart();
        res.status(201).json({message:"carrito creado", cart});//201 manda msj de creado
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

router.get("/:cid",async (req,res)=>{
    try {
        const cart= await cm.getCartById(req.params.cid);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post("/:cid/product/:pid", async(req,res)=>{
    try{
        const quantly= req.body.quantly||1;
        const cart= await cm.addProductToCart(req.params.cid, req.params.pid, quantly);
        res.json({message:"producto agregado", cart});
    } catch(e){
        res.status(500).json({ error: e.message });
    }
});
module.exports = router;