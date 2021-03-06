var pg = require('pg');
var MnkGame = require('../lib/game.js');

var conString = `postgres://pppetrov:${process.env.PG_PASSWORD}@localhost/mnk-game`;

var handleError = function(err, client, done) {
    if(!err) return false;
    if(client){
        done(client);
    }
    console.log('Connection Error');
    return true;
};


module.exports.renderGames = function (res) {
    pg.connect(conString, function(err, client, done) {

        if(handleError(err, client, done)) return;

        client.query('SELECT * FROM games', function(err, result) {
            if(handleError(err, client, done)) return; 
            res.render('index', {games: result.rows});
            done();
        });
    });
};

module.exports.writeChallange = function (params, res, addGame) {
    console.log(params);
    pg.connect(conString, function(err, client, done) {

        if(handleError(err, client, done)) return;

        client.query('INSERT INTO challenges (url, game_id) VALUES ($2, $1)', params, function(err, result) {
            if (handleError(err, client, done)) return;
            res.send({id: params[1]});
            done();
        });

        var url = params[1];
        client.query('SELECT games.spec FROM (SELECT * FROM challenges WHERE url = $1) T LEFT JOIN games ON T.game_id = games.id', [url], function(err, result) {
            if (handleError(err, client, done)) return;

            var spec = JSON.parse(result.rows[0].spec);
            addGame(url, new MnkGame(spec));
            done();
        });
        
        
    });
};

module.exports.getGame = function (url, res) {
    console.log(url);
    pg.connect(conString, function(err, client, done) {

        if(handleError(err, client, done)) return;

        client.query('SELECT games.name, games.type, games.spec FROM (SELECT * FROM challenges WHERE url = $1) T LEFT JOIN games ON T.game_id = games.id', [url], function(err, result) {
            if (handleError(err, client, done)) return;

            var spec = JSON.parse(result.rows[0].spec);
            console.log(result.rows);
            res.render('play', {rows: spec.m, columns: spec.n, spec: spec});
            done();
        });
        
    });

};

module.exports.initiateGame = function (url, game, player, io) {
    console.log(url);
    pg.connect(conString, function(err, client, done) {

        if(handleError(err, client, done)) return;

        client.query('SELECT games.name, games.type, games.spec FROM (SELECT * FROM challenges WHERE url = $1) T LEFT JOIN games ON T.game_id = games.id', [url], function(err, result) {
            if (handleError(err, client, done)) return;

            var spec = JSON.parse(result.rows[0].spec);
            console.log(result.rows);
            game[url] = new MnkGame(spec);
            player.addToGame(game[url]);
            game[url].setRadio(io, url);
            console.log(game);
            done();
        });        
    });

};

module.exports.populateGames = function(addGame) {
    
    pg.connect(conString, function(err, client, done) {

        if(handleError(err, client, done)) return;

        client.query('SELECT games.spec, challenges.url FROM challenges LEFT JOIN games ON challenges.game_id = games.id', function(err, result) {
            result.rows.forEach(function(game) {
                addGame(game.url, new MnkGame(JSON.parse(game.spec)));
            });
        });
    });
    
};

module.exports.addGame = function(url, games) {
    pg.connect(conString, function(err, client, done) {

        if(handleError(err, client, done)) return;

        client.query('SELECT games.spec FROM (SELECT * FROM challenges WHERE url = $1) T LEFT JOIN games ON T.game_id = games.id', [url], function(err, result) {
            if (handleError(err, client, done)) return;

            var spec = JSON.parse(result.rows[0].spec);
            console.log(result.rows);
            games[url] = new MnkGame(spec);
            done();
        });

    });

};


