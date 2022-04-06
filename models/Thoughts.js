const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema(
  {
  // Set custom ID 
  reactionId: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId()
  },
  reactionBody: {
      type: String,
      required: true,
      maxlength: 280
  },
  username: {
      type: String,
      required: true
  },
  createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
  }
  },
  {
  toJSON: {
      getters: true
  } 
  }
);
    

const thoughtSchema = new mongoose.Schema(
  {
  thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280
  },
  createdAt: {
      type: Date,
      default: Date.now,
      // Moment
      get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
  },
  username: {
      type: String,
      required: true
  },
  // Use ReactionsSchema to validate data
  reactions: [reactionSchema]
  },
  {
  toJSON: {
      virtuals: true,
      getters: true
  },
  id: false
  }
)

thoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

const Thoughts = mongoose.model('Thoughts', thoughtSchema);

module.exports = Thoughts;
