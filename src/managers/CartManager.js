const { promises: fs } = require('fs');
const path = require('path');
const { resolve } = require('path');

class cartManager{
    constructor(filepath){
        this.path= path.resolve(filepath);
    }

    async ensureFile(){
        try {
            await fs.access(this.path);
        } catch (error) {
            await fs.writeFile(this.path, '[]', 'utf-8');
        }
    }

    async readAll(){
        await this.ensureFile();
        const data= await fs.readFile(this.path, 'utf-8');
        return JSON.parse(data);
    }

    async writeFile(data){
        await fs.writeFile(this.path, JSON.stringify(data, null, 2), 'utf-8');
    }

    nextId(carts){
        if (carts.length===0) return 1;
        return Math.max(...carts.map(c=>c.id))+1;
    }

    async createCart(){
        const carts= await this.readAll();
        const newCart={
            id: this.nextId(carts),
            products: []
        }
        carts.push(newCart);
        await this.writeFile(carts);
    }

    async getCartById(id){
        const carts= await this.readAll();
        return carts.find(c=>c.id===Number(id))
    }

    async addProductToCart(cartId, productId, quantly=1){
        const carts= await this.readAll();
        const cid= carts.find(c=>c.id===Number(cartId));

        const pid= Number(productId);
        const item= carts[cid].products.find(p=>p.product===pid);

        if (item) item.quantly+1;
        else carts[cid].products.push({product: pid, quantly});

        await this.writeFile(carts);
        return carts[cid];
    }

    async deletCart(cartId){
        const carts= await this.readAll();
        if(!carts.find(c=>c.id===Number(cartId))) throw new Error("carrito no encontrado");
        
        const newCarts= carts.filter(c=>c.id!==Number(cartId));

        await this.writeFile(newCarts);
        return newCarts;
    }

}
module.exports= cartManager;