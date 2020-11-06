var express = require('express');
var app = express();
var myParser = require("body-parser");
var fs = require('fs');
var data = require('./public/product_data.js');
var products = data.products;

function isStrNonNegInt(str, errlog = false){
    var errors = []; // assume no errors at first
    if(Number(str) != str) {
        errors.push('Not a number!'); // Check if string is a number value
        return errlog ? errors : (errors.length == 0);
    }
    if(str < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(str) != str) errors.push('Not an integer!'); // Check that it is an integer
    return errlog ? errors : (errors.length == 0);
}

function process_quantity_form(POST, response){
    let model = products[0]['model'];
    let model_price = products[0]['price'];    

    if (typeof POST['quantity_textbox'] != 'undefined') {
        let purchase_qty = POST['quantity_textbox'];
        if (isStrNonNegInt(purchase_qty)) {
            var contents = fs.readFileSync('./views/display_quantity_template.view', 'utf8');
            response.send(eval('`' + contents + '`')); // render template string
        } else {
            response.send(`${purchase_qty} is not a quantity!`);
        }
    }
}

app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));

app.post("/process_form", function (request, response) {
    process_quantity_form(request.body,response)
});

app.get('/test', (req,res)=>{
    res.send("test");
});

app.get('/', (req,res)=>{
    res.redirect("order_page.html");
});

app.use(express.static('./public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here
