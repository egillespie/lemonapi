var products = require('./products')
var express = require('express')
var app = express()
var port = process.env.PORT || 8080
var bodyParser = require('body-parser')

app.use(bodyParser.json())

app.get('/', function (request, response) {
  response.json({
    welcome: 'welcome to my API!'
  })
})

app.get('/products', function (request, response) {
  response.json(products)
})

app.get('/products/:slug', function (request, response) {
  if (!products[request.params.slug]) {
    response.status(404).end('sorry, no such product: ' + request.params.slug)
    return
  }
  response.json(products[request.params.slug])
})

app.post('/products', function (request, response) {
  var slug = request.body.name.trim().toLowerCase().split(' ').join('-')
  products[slug] = {
    name: request.body.name.trim(),
    price: '$' + parseFloat(request.body.price).toFixed(2)
  }
  response.redirect('/products/' + slug)
})

app.delete('/products/:slug', function (request, response) {
  if (!products[request.params.slug]) {
    response.status(404).end('sorry, no such product: ' + request.params.slug)
    return
  }
  delete products[request.params.slug]
  response.redirect('/products')
})

app.put('/products/:slug', function (request, response) {
  if (!products[request.params.slug]) {
    response.status(404).end('sorry, no such product: ' + request.params.slug)
    return
  }
  var product = products[request.params.slug]
  if (request.body.name) {
    product.name = request.body.name.trim()
  }
  if (request.body.price) {
    product.price = '$' + parseFloat(request.body.price).toFixed(2)
  }
  response.redirect('/products/' + request.params.slug)
})

app.use(function(request, response, next) {
  response.status(404).end(request.url + ' not found')
})

app.listen(port)
