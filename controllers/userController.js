const { User } = require('../models');

module.exports = {
  getUsers(req, res) {
    User.find()
      .select('-__v')
      .then((user) => res.json(user))
      .catch((err) => {
        console.error({ message: err });
        return res.status(500).json(err);
      });
  },
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => console.error(err));
  },
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .then(() => res.json({ message: 'User and associated apps deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  addFriend({params}, res) {
		User.findOneAndUpdate(
			{_id: params.userId},
			{$addToSet: {friends: params.friendId}},
			{new: true, runValidators: true}
		)
		.then((data) => {
			if(!data) {
				res.status(400).json({message: 'No User found with this Id.'})
			}
			res.json(data)
		})
		.catch((err) => res.json(err))
	},
	removeFriend({params}, res) {
		User.findOneAndUpdate(
			{_id: params.userId},
			{ $pull: {friends: params.friendId}},
			{new : true}
		)
		.then((data) => res.json(data))
		.catch((err) => res.json(err))
	}
};
