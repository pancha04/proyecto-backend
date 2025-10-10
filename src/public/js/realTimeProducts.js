const socket= io();

function renderList(products){
    const ul=document.getElementById('productsList');
    ul.innerHTML=products.map(p=>'<li> ${p.name} - ${p.price}</li>').join('');
}

socket.on('products', (products=>{
    renderList(products);
}))