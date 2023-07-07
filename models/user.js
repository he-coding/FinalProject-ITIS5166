const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Trade',
        },
    ],
    watchlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Trade',
        },
    ],
});
userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, saltRounds, (err, hash) => {
        if (err) return next(err);

        user.password = hash;
        next();
    });
});
userSchema.methods.comparePassword = function(candidatePassword) {
    const user = this;
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if (err) {
                console.error('comparePassword error:', err);
                return reject(err);
            }
            console.log('comparePassword candidatePassword:', candidatePassword);
            console.log('comparePassword stored password:', user.password);
            console.log('comparePassword isMatch:', isMatch);
            resolve(isMatch);
        });
    });
};
// userSchema.methods.comparePassword = function(candidatePassword) {
//     const user = this;
//     try {
//         console.log('comparePassword candidatePassword:', candidatePassword);
//         console.log('comparePassword stored password:', user.password);
//         const isMatch = bcrypt.compareSync(candidatePassword, user.password);
//         console.log('comparePassword isMatch:', isMatch);
//         return isMatch;
//     } catch (err) {
//         console.error('Error in comparePassword:', err);
//         return false;
//     }
// };


const User = mongoose.model('User', userSchema);
module.exports = User;
