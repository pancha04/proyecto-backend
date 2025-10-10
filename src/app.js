const express= require('express');
const handlebars= require('express-handlebars');
const PORT =3000
const path= require('path');

const app=express()

const viewsRouter= require('./routes/viewsRouter');
const productRouter= require('./routes/ProductRouter');
const cartRouter= require ('./routes/CartRouter');

const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine('handlebars', handlebars.engine());
app.set('views','./src/views');
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, '/public'), { index: false }));

app.set('io', io);

app.get("/products", (req,res)=>{
    res.render('layouts/home', {products, layout:false});
})


app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);

io.on('connection', (socket) => {
    console.log('usuario conectado');
})

app.post('/upload', upload.single('file'), (req,res)=>{
    res.send('archivo subido')
})
http.listen(PORT, ()=>console.log(`listening on port ${PORT}`))