const mongoose = require('mongoose');

let PostModel = {};

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
    username: {
        type: String,
        required: true,
        trim: true,
        match: /^[A-Za-z0-9_\-.]{1,16}$/,
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

    return PostModel.find(search).select('post username').lean().exec(callback);
};

//updates the posts username
PostSchema.statics.updateUsername = async (oldUser, newUser ) => {
    const pChange = { username: oldUser };
    const update = { username: newUser };
    const doc = await PostModel.updateMany(pChange, {$set: update});
    return doc;
}

//finds posts in the database
PostSchema.statics.findPost = (pChange) => PostModel.find(pChange).select('post privated username createdDate').lean().exec();

//edits the selected post
PostSchema.statics.editPost = async (pChange, newPost) => {
    const update = { post: newPost }
    const doc = await PostModel.updateOne(pChange, update);
    return doc;
}

//changes the privacy of the users post
PostSchema.statics.changePPrivacy = async (pChange) => {
    const doc = await PostModel.updateOne(pChange, [{ $set: {private: {$eq: [false, '$private']}}}]);
    return doc;
}


PostModel = mongoose.model('Post', PostSchema);
module.exports = PostModel;