const { promises: fs } = require('fs');
const path = require('path');
const { resolve } = require('path');

class productManager{
    constructor(filePath){
        this.path = path.resolve(filePath);
    }

    async ensureFile(){
        try {
            await fs.access(this.path);
        } catch (error) {
            await fs.writeFile(this.path, '[]', 'utf-8');
        }
    }
    async readAll(){
        const datos= await fs.readFile(this.path,"utf-8");
        return JSON.parse(datos);
    }
    async writeFile(data){
        try {
            await fs.writeFile(this.path,JSON.stringify(data,null,2), "utf-8");
        } catch (error) {
            console.log("error al escribir el archivo",error);
        }
    }
    nextID(products){
        const max= products.reduce((m,p)=>(p.id>m?p.id:m),0)
        return max+1
    }
    async addProduct(product){
        const products= await this.readAll();
        
        const newProduct={
            id:this.nextID(products),
            name:product.name,
            price:Number(product.price),
            oferta:Boolean(product.oferta),
            stock:Number(product.stock)
        }
        products.push(newProduct);
        await this.writeFile(products);
        return newProduct;
    }
    async deleteProduct(id){
        const products = await this.readAll();
        const before = products.length;
        const after  = products.filter(p => p.id !== Number(id));
        if (after.length === before) return false;
        await this.writeFile(after);
        return true;
    }

    async getProductsById(id){
        const products= await this.readAll();
        const product= products.find(p=>p.id==Number(id))
        return product||null;
    }
}
module.exports= productManager;