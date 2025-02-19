import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowecase: true,
    validate: {
      validator: function (v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Email format not valid"
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 4
  },
  storageUsed: { // for later use not now
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

userSchema.virtual('storageUsedMB').get(function() {
  return (this.storageUsed / (1024 * 1024)).toFixed(2);
});

const User = mongoose.model('User', userSchema);

export default User;