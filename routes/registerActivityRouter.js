const express = require('express');
const bodyParser = require('body-parser');
const RegisterActivity = require('../models/registerActivity');

const registerActivityRouter = express.Router();
registerActivityRouter.use(bodyParser.json());

registerActivityRouter.route('/')
.get((req, res, next) => {
    RegisterActivity.find(req.query)
    .populate('activitySimphat')
    .then((categories) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(categories);
    })
    .catch((err) => next(err));
})
.post((req, res, next) => {
    RegisterActivity.create(req.body)
    .then((categorie) => {
        console.log("Categorie Créée :", categorie);
        res.statusCode = 200;  
        res.setHeader('Content-Type', 'application/json');
        res.json(categorie);
    })
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('Opération PUT non prise en charge sur /categories');
})
.delete((req, res, next) => {
    RegisterActivity.deleteMany({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    })
    .catch((err) => next(err));
});


registerActivityRouter.route('/:categorieId')
.get((req,res,next) => {
    RegisterActivity.findById(req.params.categorieId)
    .then((categorie) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(categorie);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('Opération POST non prise en charge sur /categories/'+ req.params.categorieId);
})
.put((req, res, next) => {
    RegisterActivity.findByIdAndUpdate(req.params.categorieId, {
        $set: req.body
    }, { new: true })
    .then((categorie) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(categorie);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    RegisterActivity.findByIdAndRemove(req.params.categorieId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

// Route pour récupérer toutes les RegisterActivity avec le status "true"
registerActivityRouter.route('/status/true')
.get((req, res, next) => {
    RegisterActivity.find({ status: true })
    .populate('activitySimphat')
    .then((activities) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(activities);
    })
    .catch((err) => next(err));
});

// Route pour récupérer toutes les RegisterActivity avec le status "false"
registerActivityRouter.route('/status/false')
.get((req, res, next) => {
    RegisterActivity.find({ status: false })
    .populate('activitySimphat')
    .then((activities) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(activities);
    })
    .catch((err) => next(err));
});

module.exports = registerActivityRouter;