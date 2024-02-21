const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    totalPrice: { type: Number, required: true },
    userId: { type: mongoose.ObjectId, ref: "user" },
    cartItems: {
      type: [
        {
          productId: { type: mongoose.ObjectId, ref: "product" },
          count: { type: Number, required: true },
          price: { type: Number, required: true },
        },
      ],
      required: false,
      default: [],
    },
    price: { type: Number, required: true },
    category: {
      name: { type: Number, required: true },
    },
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
    model = connection.model("Cart", schema);
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
};
