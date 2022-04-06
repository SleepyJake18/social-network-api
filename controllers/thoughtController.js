const { User, Thoughts } = require("../models");

module.exports = {
  getThoughts(req, res) {
    Thoughts.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  getSingleThought(req, res) {
    Thoughts.findOne({ _id: req.params.thoughtId })
    .select('-__v')
    .populate(`reactions`)
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  createThought(req, res) {
    Thoughts.create(req.body)
      .then((thought) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({
                message: "Thought created, but found no post with that ID",
              })
          : res.json("Created the thought 🎉")
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  deleteThought(req, res) {
    Thoughts.findOneAndRemove({ _id: req.params.thoughtId })
      .then((data) => {
        if (!data) {
          res.status(404).json({ message: "No thought found with this id." });
        }
        return User.findOneAndUpdate(
          { thoughts: req.params.thoughtId },
          { $pull: { thoughts: req.params.thoughtId } },
          { new: true }
        );
      })
      .then((data) => {
        if (!data) {
          res.status(404);
        } else {
          res.json({ message: "Thought Deleted" });
        }
      });
  },
  updateThought(req, res) {
    Thoughts.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .then((data) => {
        if (!data) {
          res
            .status(404)
            .json({ message: "No thought was found with this id." });
        }
        res.json(data);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  addReaction(req, res) {
    Thoughts.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    ).then((data) => {
      if (!data) {
        res.status(404).json({ message: "not thought found with this id." });
        return;
      }
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
  },
  deleteReaction(req, res) {
    Thoughts.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    ).then((data) => {
      if (!data) {
        res.status(400).json({ message: "No thought found with this id." });
        return;
      }
      res.json({ message: "Reaction deleted." });
    });
  },
};
