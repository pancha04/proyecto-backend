const { promises: fs } = require('fs');
const path = require('path');
const { resolve } = require('path');

class productManager{
    constructor(filePath){
        this.path = path.resolve(filePath);
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
        const{title, description, price, thumbnail, code, stock}= product;
        if(!title||!description||price==null||!thumbnail||!code||stock==null){
            throw new Error("Todos los campos son obligatorios");
        }
        const newProduct={
            id:this.nextID(products),
            title:product.title,
            description:product.description,
            price:product.price,
            thumbnail:product.thumbnail,
            code:product.code,
            stock:product.stock
        }
        products.push(newProduct);
        await this.writeFile(products);
    }
    async deleteProduct(id){
        const products= await this.readAll();
        const newProducts= products.filter(p=>p.id!==id);
        return await this.writeFile(newProducts);
    }

    async getProductsById(id){
        const products= await this.readAll();
        const product= products.find(p=>p.id==Number(id))
        return product||null;
    }
}
module.exports= productManager;