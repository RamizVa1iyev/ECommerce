const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    categoryName: { type: String, required: true },
    stockAmount: { type: Number, required: true },
  },
  {
    versionKey: false,
    additionalProperties: false,
  }
);

let model = null;

module.exports = {
  getSchema: () => schema,
  getModel: () => model,

  init: (connection) => {
    model = connection.model("Product", schema);
    return model;
  },

  get: (req, res) => {
    const _id = req.query._id;
    if (_id) {
      model
        .findOne({ _id })
        .then((data) => {
          if (data) {
            res.json(data);
          } else {
            res.status(404).json({ error: "No such object" });
          }
        })
        .catch((err) => {
          res.status(408).json({ error: err.message });
        });
    } else {
      let aggregation = [
        { $sort: { name: 1 } },
        { $match: { name: { $regex: new RegExp(req.query.search, "i") } } },
      ];
      aggregation.push({ $skip: parseInt(req.query.skip) || 0 });
      aggregation.push({ $limit: parseInt(req.query.limit) || 10 });
      model
        .aggregate(aggregation)
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          res.status(408).json({ error: err.message });
        });
    }
  },

  post: (req, res) => {
    const instance = new model(req.body);
    instance
      .save()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(406).json({ error: err.message });
      });
  },

  put: (req, res) => {
    const _id = req.query._id;
    model
      .findOneAndUpdate({ _id }, req.body, { new: true, runValidators: true })
      .then((updated) => {
        if (updated) {
          res.json(updated);
        } else {
          res.status(404).json({ error: "No such object" });
        }
      })
      .catch((err) => {
        res.status(406).json({ error: err.message });
      });
  },

  delete: (req, res) => {
    const _id = req.query._id;
    model
      .findOneAndDelete({ _id })
      .then((deleted) => {
        if (deleted) {
          res.json(deleted);
        } else {
          res.status(404).json({ error: "No such object" });
        }
      })
      .catch((err) => {
        res.status(400).json({ error: err.message });
      });
  },
};
