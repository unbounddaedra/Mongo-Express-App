var express    = require('express');       
var app        = express();                 
var bodyParser = require('body-parser');

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/db_name'); 

var User     = require('./app/models/user');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8081;        


var router = express.Router();             

router.use(function(req, res, next) {
    console.log('Request Detected, moving to next section');
    next(); 
});

router.get('/', function(req, res) {
    res.json({ message: 'GET Request Successful' });   
});

router.route('/users')
    .post(function(req, res) {
        var user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.todo = req.body.todo;

        user.save(function(err){
            if (err)
                res.send(err);
            
            res.json({ message: 'User Successfully Created'});
        })
    })

    .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err)

            res.json(users);
        })
    })

    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err)

            res.json(user);
        })
    })

    .put(function(res, req) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err)
            
            user.name = req.body.name
            user.email = req.body.email
            user.todo = req.body.todo

            user.save(function(err) {
                if (err)
                    res.send(err)

                res.json({ message: 'User has been updated successfully'})
            })
        })
    })

    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err)

            res.json({ message: 'User has been successfully removed'})
        })
    })


app.use('/api', router);


app.listen(port);
console.log('Server Running on Port ' + port);
