const express= require('express');
//const mongoose= require('mongoose');
const handlebars= require('express-handlebars');
const PORT =3000
const path= require('path');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, 'uploads') });

const app=express()

//mongoose.connect('mongodb+srv://panchaponto07_db_user:<db_password>@cluster0.wpuk4qm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
//.then(()=>console.log('DB connected'))
//.catch(e=>console.log(e))

const user=require('./routes/userRouter');
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

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);
//app.use('/api', user);

io.on('connection', async (socket) => {
  console.log('usuario conectado');
  try {
    socket.emit('products', await pm.readAll());
  } catch (e) {
    console.error('Error al enviar lista inicial:', e.message);
  }
});

app.post('/upload', upload.single('file'), (req,res)=>{
    res.send('archivo subido')
})
http.listen(PORT, ()=>console.log(`listening on port ${PORT}`))