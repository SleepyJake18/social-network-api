const { Schema, model } = require('mongoose');

// Schema to create Post model
const userSchema = new Schema(
  {
  username: {
      type: String,
      unique: true,
      required: true,
      trim: true
  },
  email: {
      type: String,
      required: true,
      unique: true,
      // use REGEX to validate correct email
      match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/]
  },
  thoughts: [{
      type: Schema.Types.ObjectId,
      ref: 'Thoughts'
  }],
  friends: [{
      type: Schema.Types.ObjectId,
      ref: 'Users'
  }]
  },
  {
  toJSON: {
      virtuals: true,
      getters: true,
  },
  id: false
  }
)

// Create a virtual property `tagCount` that gets the amount of comments per user
userSchema
  .virtual('friendCount')
  // Getter
  .get(function () {
    return this.friends.length;
  });

// Initialize our User model
const User = model('User', userSchema);

module.exports = User;
