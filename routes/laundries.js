var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

/* GET /laundries - Récupérer la liste des sujets */
router.get('/', function(req, res, next) {
  const { db } = req.app.locals;
  const page = req.query.page || 1;
  const limit = 6;
  const skip = (page - 1) * limit;

  let query = {};
  if (req.query.search) {
    query.name = new RegExp(req.query.search, 'i');
  }

  db.collection('laundries').find(query).count((err, count) => {
    db.collection('laundries')
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray((err, laundries) => res.json({ count: count, limit: limit, laundries: laundries }));
  });
});

/* GET     /laundries/:id - recuperer un sujet dans api Restfull  */

router.get('/:id', (req, res) => {
  const { db } = req.app.locals;
  const { id } = req.params;
  db.collection('laundries').findOne({ _id: new ObjectID(id) },{ $set: req.body },(err, laundry) => res.json(laundry));
  console.log('laundry')
});

/*  PUT    /laundries/:id  - Modifier un sujet - pour mettre à jour l'objet ou rajout de questions  */

router.put('/:id', (req, res) => {
  const { db } = req.app.locals;
  const { id } = req.params;
  db.collection('laundries').updateOne({ _id: new ObjectID(id) },{ $set:req.body },(err, laundry) => res.json(laundry));
  });

router.post('/', (req, res) => {
  const { db } = req.app.locals;
  db.collection('laundries').insertOne(req.body, (err, laundry) => res.json(laundry));
});

/*  DELETE   /laundries/:id  - Supprimer une laverie  */

router.delete('/:id', (req, res) => {
  const { db } = req.app.locals;
  const { id } = req.params;
  db.collection('laundries').deleteOne({ _id: new ObjectID(id) }, (err, response) => res.json(response));
});

module.exports = router;