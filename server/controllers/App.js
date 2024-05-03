const models = require('../models');

const { Account } = models;

const {Post} = models;

const page = (req, res) => res.render('app');

const errPage = (req,res) => res.render('404');

//makes post with all required data
const makePost = async (req,res) => {
    if(!req.body.post){
        return res.status(400).json({ error: "There must be text prior to posting."});
    }
    const postData = {
        post: req.body.post,
        privated: req.body.privated,
        username: req.body.username,
        poster: req.session.account._id,
    };

    try {
        const newPost = new Post(postData);
        await newPost.save();
        return res.status(201).json({ post: newPost.post, privated:newPost.privated, username:newPost.username });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'An error occured making the post' });
    }
};

//edits the exisiting post
const editPost = async (req,res) => {
    try {
        const pChange = {_id: req.body._id};
        await Post.editPost(pChange, req.body.newPost);
        return res.status(200).json({_id: req.body._id});
    } catch (err) {
        return res.status(400).json({ error: 'Error while changing the privacy!'});
    }
}

//deletes the selected post
const deletePost = async (req,res) => {
    try {
        
        await Post.deleteOne({_id: req.body._id});
        return res.status(200).json({_id: req.body._id});
    } catch (err) {
        return res.status(400).json({ error: 'Error while deleting your post!'});
    }
}

//gets the private posts
const getUserPosts = async (req,res) => {
    try{
        const userGet = await Account.getUsername(req.session.account._id);
        const query = {username: userGet.username};
        const docs = await Post.find(query).select('post privated username createdDate').lean().exec();
        return res.json({posts: docs});
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'Error retrieving posts!'});
    }

};

//gets all public posts (ones that are not privated)
const getPublicPosts = async (req,res) => {
    try{
        const query = {privated: false};
        const docs = await Post.find(query).select('post privated username createdDate').lean().exec();

        return res.json({posts: docs});
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'Error retrieving posts!'});
    }

};

//changes the privacy of the post
const changePPrivacy = async (req,res) => {
    try {
        const pChange = {_id: req.body._id};
        await Post.changePPrivacy(pChange);
        return res.status(200).json({_id: req.body._id});
    } catch (err) {
        return res.status(400).json({ error: 'Error while changing the privacy!'});
    }
}


module.exports = {
  page,
  errPage,
  makePost,
  editPost,
  deletePost,
  getUserPosts,
  getPublicPosts,
  changePPrivacy,
};