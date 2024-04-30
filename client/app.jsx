const helper = require('./helper.js');
const React  = require('react');
const {createRoot} = require('react-dom/client');

const handlePost = (e) => {
    e.preventDefault();
    helper.hideError();

    const post = e.target.querySelector('#posts').value;
    const privated = e.target.querySelector('#private').checked;

    if(!post){
        helper.handleError('Write something to Post-It!');
        return false;
    }

    //const display = data.username.display;

    helper.sendPost(e.target.action, {post, privated, loadPosts});
    return false;
};

const Post = (props) => {
    return (
        <form id="postForm"
            name="postForm"
            onSubmit={handlePost}
            action="/app">
            <label htmlFor="posts">Make a Post-It: </label>
            <input type="text" id="posts" name="posts" placeholder="Make a Post-It" maxLength="300" />
            <label htmlFor="private">Public or Private?</label>
            <input type="checkbox" id="private" name="private" />
            <input className="postSubmit" type="submit" value="Post-It" />
        </form>
    );
};

const PostList = (props) => {
    if(props.posts.length === 0){
        return (
            <div>
                <h2>No recent posts...</h2>
            </div>
        );
    }

    const postFull = props.posts.slice(0).reverse().map(post => {
        let postDate = post.createdDate.toString();
        let date = postDate.substring(0,10);
        let time = postDate.substring(11,16);
        let tdPost = date + ', ' + time;

        return (
            <div key={post._id} id="postArea" >
                <div id="username">
                    <label htmlFor="postsUsername">Posted by: </label>
                    <h2 id="postsUsername" >{post.username}</h2>
                </div>
                <h2 id="td">{tdPost}</h2>
                <div id="postMsg">
                    <h3 id="postMsg">{post.post}</h3>
                </div>
            </div>
        );
    });

    return (
        <div>
            {postFull}
        </div>
    );
};

const loadPosts = () => {
    createRoot(document.getElementById('posts')).render(<PostList />);
}

const init = () => {
    const root = createRoot(document.getElementById('makePost'));

    root.render(<Post />);

    loadPosts();
};

window.onload = init;