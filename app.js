const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');

mongoose.connect('mongodb://localhost:27017/wikiDB');

const articleSchema = {
    title: String,
    content: String,
};

const app = express();
const port = 3000;
const Article = mongoose.model('Article', articleSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.route('/articles')
    .get((req, res) => {
        Article.find({})
            .then((foundItem) => {
                res.send(foundItem);
            })
            .catch((err) => {
                res.send(err);
            });
    })
    .post((req, res) => {
        const article = new Article({
            title: req.body.title,
            content: req.body.content,
        });
        article.save()
            .then(res.send('Successfully added a new article'))
            .catch((err) => {
                res.send(err);
            });
    })
    .delete((req, res) => {
        Article.deleteMany({})
            .then(res.send('Articles are deleted successfully'))
            .catch((err) => {
                res.send(err);
            });
    });

app.route('/articles/:topic')
    .get((req, res) => {
        const Topic = req.params.topic;
        Article.findOne({ title: Topic })
            .then((foundedItem) => {
                res.send(foundedItem);
            })
            .catch((err) => {
                res.send(err);
            });
    })
    .put((req, res) => {
        Article.updateOne({ title: req.params.topic }, { content: req.body.content })
            .then(res.send('Successfully Updated the article'))
            .catch((err) => {
                res.send(err);
            });
    }).patch((req, res) => {
        Article.updateOne({ title: req.params.topic },
            { $set: req.body })
            .then(res.send('Successfully Updated the article'))
            .catch((err) => {
                res.send(err);
            });
    })
    .delete((req, res) => {
        Article.deleteOne({title: req.body.title})
            .then(res.send('Articleis deleted successfully'))
            .catch((err) => {
                res.send(err);
            });
    });

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
