// to create a simple server

// 1. create server using Node http module
var http = require('http');


http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end('<html><body>Home, URL was: ' + request.url + '</body></html>');
    console.log('request is ' + request.url);
}).listen(3001, 'localhost');

console.log('server with raw http running at http://localhost:3001');

// 2. create server using connect
var connect = require('connect');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');

var app = connect()
    .use(bodyParser.urlencoded({ extended: false })) // this is important so that we can parse POST data
    .use(serveStatic('public'))
    .use(function(req, res) {
        if (req.url === '/process') {
            // when accessing POST parameters we use: request.body.parameter_name
            var output = req.body.name + ' will repeat ' + req.body.repeat + ' times<br/>';

            for (var i = 0; i < req.body.repeat; i++) {
                output += req.body.name + '<br/>';
            }

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(output);
        } else {
            res.end("couldn't find it");
        }
    })
    .listen(3000);
console.log('server with connect running at http://localhost:3000');

// 3. create server using express
var express = require('express');

var expressapp = express();

// here is how to handle a HTTP GET request
expressapp.get('/recipes', function(req, res) {
    res.send('<h1>All recipes</h1>');
});


expressapp.get('/recipes/:title', function(req, res) {
    res.send('<h1>' + req.params.title + '</h1>');
});

// here is an example of a fall-back url handlers
expressapp.get('/*', function(req, res) {
    res.send('if all else fails, we hit this page');
});

expressapp.listen(3002);
console.log('server with express running on http://localhost:3002');


// 4. create server using express to layout views
var recipes = require('./data/recipes').data;

var app_with_views = express();
app_with_views.get('/', function(req, res) {
    res.render('index.pug', {title: 'Clever Kitches'});
});

app_with_views.get('/recipes-dummy', function(req, res) {
    res.render('layout.pug', {
        title: 'Clever kitchens - Recipes',
        body: '<h1>All Recipes here for me</h1>'
    });
});

// listing data, in this case, recipes
app_with_views.get('/recipes', function(req, res) {
    res.render('recipes.pug', {
        title: 'Clever kitchens - Recipes',
        recipes: recipes
    });
});

app_with_views.get('/recipes-dummy/:title', function(req, res) {
    res.send('<h1>' + req.params.title + '</h1>');
});

// here we domonstrate filtering data
app_with_views.get('/recipes/:title', function(req, res) {
    var data = recipes.filter(function(recipe) {
        return recipe.url === req.params.title;
    });

    if (data.length > 0) {
        data = data[0];
        data.title = 'Clever Kitchens - Recipe';

        res.render('recipe.pug', data);
    } else {
        // this is an example of how to return a 404 page
        res.status(404).render('error.pug', {title: 'Recipe Not Found'});
    }
});

app_with_views.get('/*', function(req, res) {
    res.status(404).render('error.pug', {title: 'Error'});
});

app_with_views.listen(3003);
console.log('server with express with views running on http://localhost:3003');


// 5. create server using express and putting view handler functions in separate files

var app_with_views_organised = express();
app_with_views_organised.use(bodyParser.urlencoded({ extended: false}));
var recipes  = require('./recipes');
app_with_views_organised.get('/', function(req, res) {
    res.render('index.pug', {title: 'Clever Kitches'});
});

app_with_views_organised.get('/recipes', recipes.list);
app_with_views_organised.get('/recipes/suggest', recipes.suggest_get);
// And this is how we handle HTTP POST requests
app_with_views_organised.post('/recipes/suggest', recipes.suggest_post);
app_with_views_organised.get('/recipes/:title', recipes.single);
app_with_views_organised.get('/*', function(req, res) {
    res.status(404).render('error.pug', {title: 'Error'});
});
app_with_views_organised.listen(3004);
console.log('server with express with views organised running on http://localhost:3004');
