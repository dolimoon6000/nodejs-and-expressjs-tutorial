var recipes = require('./data/recipes').data;

exports.list = function(req, res) {
    res.render('recipes.pug', {
        title: 'Clever kitchens - Recipes',
        recipes: recipes
    });
};

exports.single = function(req, res) {
    var data = recipes.filter(function(recipe) {
        return recipe.url === req.params.title;
    });

    if (data.length > 0) {
        data = data[0];
        data.title = 'Clever Kitchens - Recipe';

        res.render('recipe.pug', data);
    } else {
        res.status(404).render('error.pug', {title: 'Recipe Not Found'});
    }
};

exports.suggest_get = function(req, res) {
    res.render('suggest.pug', {title:'Suggest a recipe'});
};


exports.suggest_post = function(req, res) {
    res.render('suggest_result.pug', {
        name: req.body.name,
        title: 'Clever Kitchens - Thanks!',
        ingredients: req.body.ingredients,
        directions: req.body.directions
    });
};
