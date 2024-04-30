const mongoose = require('mongoose');

let PostModel = {

};

const PostSchema = new mongoose.Schema({
    post: {
        type: String,
        required: true,
        trim: true,
        match: /^[A-Za-z0-9_\-.]{1,16}$/,
        maxLength: 300,
    },
    private: {
        type: Boolean,
        required: true,
        default: true,
    },
    poster: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'Account',
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

PostSchema.statics.toAPI = (doc) => ({
    post: doc.post,
    private: doc.private,
});

PostSchema.statics.findByOwner = (accountId, callback) => {
    const search = {
        poster: mongoose.Types.ObjectId(accountId),
    }

    return PostModel.find(search).select('post').lean().exec(callback);
};

PostModel = mongoose.model('Post', PostSchema);
module.exports = PostModel;