const helper = require('./helper.js');
const React  = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

//Handles posts user posts on the site
const handlePost = async (e, onPostAdded) => {
    e.preventDefault();
    helper.hideError();

    const response = await fetch('/getUsername');
    const data = await response.json();
    const username = data.docs.username;

    const post = e.target.querySelector('#posts').value;

    const privated = e.target.querySelector('#private').checked;

    if(!post){
        helper.handleError('Write something to Post-It!');
        return false;
    }
    //collects all required data and sendPost
    helper.sendPost(e.target.action, {post, privated, username}, onPostAdded);
    return false;
};

//handles edit post and sendPost
const handleEditPost = (e) => {
    e.preventDefault();
    helper.hideError();

    const _id = e.target.querySelector('#_id').value;
    const newPost = e.target.querySelector('#post').value;

    helper.sendPost(e.target.action, {_id, newPost});
}

//handles deleting posts and sendPost
const deletePost = (e) => {
    e.preventDefault();
    helper.hideError();

    const _id = e.target.querySelector('#_id').value;
    helper.sendPost(e.target.action, {_id});
}

//handles changing the privacy of the post and sendPost
const changePPrivacy = (e) => {
    e.preventDefault();
    helper.hideError();

    const _id = e.target.querySelector('#_id').value;
    helper.sendPost(e.target.action, {_id});
}

//handles changing the password of the posts and sendPost
const changePassword = (e) => {
    e.preventDefault();
    helper.hideError();

    const newPass = e.target.querySelector('#pass').value;
    const newPass2 = e.target.querySelector('#pass2').value;

    if (!newPass || !newPass2) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {newPass, newPass2});
    return false;
};

//handles changing the username of the username and sendPost
const changeUsername = (e) => {
    e.preventDefault();
    helper.hideError();

    const oldUser = document.getElementById('_username').value;
    const newUser = e.target.querySelector('#user').value;

    helper.sendPost(e.target.action, {oldUser, newUser});
    return false;
};


//handles edit post window
const EditPostWindow = (props) => {
    return (
        <form id="editPostForm"
            name="editPostForm"
            onSubmit={handleEditPost}
            action="/editPost"
            method="POST">
            <input id="_id" type="hidden" name='_id' value={props._id} />
            <h2>{props._id}</h2>
            <input id='post' type="text" name='post' placeholder='Edit your post here' maxLength="300" />
            <input type="submit" className='editPostSubmit' value="Edit Post" />
        </form>
    );
};

  //handles the delete post window
  const DeletePostWindow = (props) => {
    return(
        <form id='deleteButton'
            name="deleteButton"
            onSubmit={deletePost}
            action="/delete"
            method='POST'>
            <input type="submit" value="Delete Post?" />
            <h2>{props._id}</h2>
            <input id="_id" type="hidden"name='_id' value={props._id} />
        </form>
    )
  };

  //handles the changing privacy window
  const ChangePPrivacyWindow = (props) => {
    console.log(props.post.privated.toString());
    return(
        <form id='privacyButton'
        name='privacyButton'
        onSubmit={changePPrivacy}
        action="/changePPrivacy"
        method='POST'>
        <input type="submit" value="Change Privacy?" />
        <h3>{props.post.privated.toString()}</h3>
        <input id="_id" type="hidden" name='_id' value={props.post._id} />
        </form>
    );
  }

  //handles the changing of the password window
  const ChangePassWindow = (props) => {
    return (
        <form id='changePassForm'
        name='changePassForm'
        onSubmit={changePassword}
        action="/changePass"
        method='POST'
        >
            <label htmlFor="pass">New Password: </label>
            <input id="pass" type="password" name="pass" placeholder="new password" />
            <label htmlFor="pass2">Confirm New Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype new password" />
            <input className="formSubmit" type="submit" value="Change Password" />
        </form>      
    );
};

//handles the changing of the username window
const ChangeUsernameWindow = (props) => {
    return (
        <form id='changeUsernameForm'
        name='changeUsernameForm'
        onSubmit={changeUsername}
        action="/changeUsername"
        method='POST'
        >
            <label htmlFor="username">New Username: </label>
            <input id="user" type="text"name="username" placeholder="username" />
            <input className="formSubmit" type="submit" value="Change Username" />
        </form>      
    );
};

//handles the post form window
const PostForm = (props) => {
    return (
        <form id="postForm"
            name="postForm"
            onSubmit={(e) => handlePost(e, props.triggerReload)}
            action="/app"
            method="POST"
            className="postForm">

            <label htmlFor="posts">Make a Post-It: </label>
            <input id="posts" type="text" name="posts" placeholder="Make a Post-It" />
            <label htmlFor="privated">Make Private?</label>
            <input id="private" type="checkbox" name="private" />
            <input id="_username" type="hidden" name="_username" value="" />
            <input className="makePostSubmit" type="submit" value="Post-It" />
        </form>
    );
};



//handles the lists of all the posts
const PostList = (props) => {
    const [posts, setPosts] = useState(props.posts);

    useEffect(() => {
        const loadPostsFromServer = async () => {

            const response = await fetch('/getUserPosts');
            const data = await response.json();
            
            setPosts(data.posts);
        };
        loadPostsFromServer();
    }, [props.reloadPosts]);

    if(posts.length === 0) {
        return (
            <div className="postArea">
                <h3 className="emptyPost">No posts from user!</h3>
            </div>
        );
    }

    const postNodes = posts.map(post => {
        return (
            <div id="postArea" >
                <div id="username">
                    <label htmlFor="postUsername">Posted by: </label>
                    <h2 id="postUsername" >{post.username}</h2>
                </div>
                {/* <h2 id="td">{tdPost}</h2> */}
                <div id="postMsg">
                    <h3 id="message">{post.post}</h3>
                </div>
                <form id='editPostButton'
                    onSubmit={renderEditPostWindow}>
                    <input type="submit" value="Edit Post?" />
                    <input id="_id" type="hidden" name='_id' value={post._id} />

                    <section id={post._id}></section>
                    </form>

                <DeletePostWindow _id = {post._id}/>
                <ChangePPrivacyWindow post ={post}/>
                
            </div>
        );
    });
    return (
        <div className="postArea">
            {postNodes}
        </div>
    );
  };


//loads the list of all the post
const App = () => {
    const [reloadPosts, setReloadPosts] = useState(false);
    return (
        <div>
            <div id="makePost">
                <PostForm triggerReload={() => setReloadPosts(!reloadPosts)} />
            </div>
            <div id="postArea">
                <PostList posts={[]} reloadPosts={reloadPosts} />
            </div>
        </div>
    );
};

const renderEditPostWindow = (e) => {
    e.preventDefault();
    helper.hideError();

    const _id = e.target.querySelector('#_id').value;
    const root = createRoot(document.getElementById(_id));
    root.render(<EditPostWindow _id={_id} />);
};

const init = () => {
    const changePassButton = document.getElementById('changePassword');
    const changeUsernameButton = document.getElementById('changeUsername');

    const root = createRoot(document.getElementById('posts'));

    changePassButton.addEventListener('click', (e) => {
        e.preventDefault();
        createRoot(document.getElementById('changePasswordSection')).render( <ChangePassWindow />);
        return false;
    });

    changeUsernameButton.addEventListener('click', (e) => {
        e.preventDefault();
        createRoot(document.getElementById('changeUsernameSection')).render( <ChangeUsernameWindow />);
        return false;
    });
    
    root.render(<App />);
};

window.onload = init;