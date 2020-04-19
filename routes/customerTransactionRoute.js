const express = require('express');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;

const CustomerTransaction = require('../models/customerTransactionModel.js');
const config = require('../config.js');

let router = express.Router();

const checkForErrors = ({ title, author, body }) => {
    let errors = {};
    let isValid = false;
    if (title === '') {
        errors = { ...errors, title: 'This field is required' }
    }
    if (author === '') {
        errors = { ...errors, author: 'This field is required' }
    }
    if (body === '') {
        errors = { ...errors, body: 'This field is required' }
    }

    if (Object.keys(errors).length > 0) {
        return { isValid, errors };
    }
    isValid = true;
    return { isValid, errors };
}

const isAuthenticated = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    const authorizationToken = authorizationHeader.split(' ')[1];
    if (authorizationToken) {
        jwt.verify(authorizationToken, config.jwtSecret, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Failed to authenticate' });
            } else {
                req.authorId = decoded.id;
                next();
            }
        });
    } else {
        res.status(403).json({ error: 'No token provided' })
    }
}

router.get('/', (req, res) => {
    CustomerTransaction.find({}, (err, articles) => {
        res.json({ articles });
    })
});



router.get('/myarticles', isAuthenticated, (req, res) => {
    CustomerTransaction.find({ authorId: req.authorId }, (err, articles) => {
        if (err) throw err;
        res.json({ articles });
    })
});

router.get('/report', (req, res) => {
    console.log(req.query, "Params");
    if (req.query.date) {
        CustomerTransaction
            .aggregate([{ $match: { "addedOn": { $gte: new Date(req.query.date) } } },
            {
                $group: {
                    _id: {
                        author: '$author',
                    },
                    count: { $sum: 1 }
                }
            },
            ]).exec((err, data) => {
                if (err) {
                    throw err;
                    console.log(err);
                }
                res.json({ data });
            });
    } else {
        res.json({});
    }

});

router.get('/:id', (req, res) => {
    CustomerTransaction.findById(req.params.id, (err, article) => {
        if (err) throw err;
        res.json({ article });
    })
});

router.post('/add', isAuthenticated, (req, res) => {
    const title = req.body.title || '';
    const author = req.body.author || '';
    const body = req.body.body || '';
    const authorId = req.authorId;

    const { isValid, errors } = checkForErrors({ title, author, body });

    if (isValid) {
        const newArticle = new CustomerTransaction({
            title: title,
            author: author,
            body: body,
            authorId: new ObjectId(authorId)
        });

        newArticle.save((err) => {
            if (err) throw err;
            else {
                res.json({ success: 'success' });
            }
        });
    } else {
        res.json({ errors });
    }
});

router.post('/edit/:id', isAuthenticated, (req, res) => {
    const title = req.body.title || '';
    const author = req.body.author || '';
    const body = req.body.body || '';
    const authorId = req.authorId;

    const { isValid, errors } = checkForErrors({ title, author, body });

    if (isValid) {
        const updatedArticle = {
            title: req.body.title,
            author: req.body.author,
            body: req.body.body,
            authorId: new ObjectId(authorId)
        };

        CustomerTransaction.findByIdAndUpdate(req.params.id, updatedArticle, err => {
            if (err) throw err;
            else res.json({ success: 'success' });
        });
    } else {
        res.json({ errors });
    }
});

router.delete('/delete/:id', isAuthenticated, (req, res) => {
    CustomerTransaction.remove({ _id: req.params.id }, err => {
        res.json({ success: 'success' });
    });
});

module.exports = router;
