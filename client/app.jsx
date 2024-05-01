const helper = require('./helper.js');
const React  = require('react');
const {createRoot} = require('react-dom/client');

//Handles posts user posts on the site
const handlePost = async (e) => {
    e.preventDefault();
    helper.hideError();

    const response = await fetch('/getUsername');
    const data = await response.json();

    const post = e.target.querySelector('#posts').value;
    const privated = e.target.querySelector('#private').checked;

    if(!post){
        helper.handleError('Write something to Post-It!');
        return false;
    }

    const username = data.username.username;

    //collects all required data and sendPost
    helper.sendPost(e.target.action, {post, privated, username}, loadPosts);
    return false;
};

//handles edit post and sendPost
const handleEditPost = (e) => {
    e.preventDefault();
    helper.hideError();

    const _id = e.target.querySelector('#_id').value;
    const newPost = e.target.querySelector('#post').value;

    helper.sendPost(e.target.action, {_id, newPost}, loadPosts);
}

//handles deleting posts and sendPost
const deletePost = (e) => {
    e.preventDefault();
    helper.hideError();

    const _id = e.target.querySelector('#_id').value;
    helper.sendPost(e.target.action, {_id}, loadPosts);
}

//handles changing the privacy of the post and sendPost
const changePPrivacy = (e) => {
    e.preventDefault();
    helper.hideError();

    const _id = e.target.querySelector('#_id').value;
    helper.sendPost(e.target.action, {_id}, loadPosts);
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

    helper.sendPost(e.target.action, {oldUser, newUser}, loadPosts);
    return false;
};

//handles the post form window
const PostForm = (props) => {
    return (
        <form id="postForm"
            name="postForm"
            onSubmit={handlePost}
            action="/app"
            method="POST"
            className="postForm">
            <label htmlFor="posts">Make a Post-It: </label>
            <input type="text" id="posts" name="posts" placeholder="Make a Post-It" />
            <label htmlFor="private">Public or Private?</label>
            <input type="checkbox" id="private" name="private" />
            <input id="_username" type="hidden" name="_username" value="" />
            <input className="postSubmit" type="submit" value="Post-It" />
        </form>
    );
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
            <input id='post' type="text" name='post' placeholder='Edit your post here' maxLength="300" />
            <input type="submit" className='editPostSubmit' value="Edit Post" />
        </form>
    );
};

const renderEditPostWindow = (e) => {
    e.preventDefault();
    helper.hideError();

    const _id = e.target.querySelector('#_id').value;
    createRoot(document.getElementById('#_id')).render(<EditPostWindow _id={_id} />, e.target.querySelector('#editPostSection'));
};

//handles the lists of all the posts
const PostList = (props) => {
    // if(props.posts.length === 0){
    //     return (
    //         <div>
    //             <h2 id="noPost">No recent posts...</h2>
    //         </div>
    //     );
    // }
  
    console.log(props);
    const postFull = props.posts.slice(0).reverse().map(post => {
        let postDate = post.createdDate.toString();
        let date = postDate.substring(0,10);
        let time = postDate.substring(11,16);
        let tdPost = date + ', ' + time;

        let changePost = false;
        let privacy = 'Public';

        if(post.username === document.getElementById('_username').value) {
            changePost = true;
            if(privacy === true) {
                privacy = 'Private';
            }
        }
        if(changePost){
            return (
                <div key={post._id} id="postArea" >
                    <div id="username">
                        <label htmlFor="postUsername">Posted by: </label>
                        <h2 id="postUsername" >{post.username}</h2>
                    </div>
                    <h2 id="td">{tdPost}</h2>
                    <div id="postMsg">
                        <h3 id="message">{post.post}</h3>
                    </div>
                    <h3 id="privacy">{privacy}</h3>

                    <form id='editPostButton'
                        onSubmit={renderEditPostWindow}>
                        <input type="submit" value="Edit Post?" />
                        <input id="_id" type="hidden" name='_id' value={post._id} />
                        <section id='editPostSection' ></section>
                        </form>

                    <DeletePostWindow />
                    <ChangePPrivacyWindow />
                </div>
            );
        }

        return (
            <div key={post._id} id="postArea">
                <div id='username'>
                    <label htmlFor="postUsername">By: </label>
                    <h3 id='postUsername' >{post.username}</h3>
                </div>
                <h3 id='td' >{tdPost}</h3>
                <div id='postMsg'>
                    <h3 id='message' >{post.post}</h3>
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
  
  //handles the delete post window
  const DeletePostWindow = (props) => {
    return(
        <form id='deleteButton'
            name="deleteButton"
            onSubmit={deletePost}
            action="/delete"
            method='POST'>
            <input type="submit" value="Delete Post?" />
            <input id="_id" type="hidden"name='_id' value={post._id} />
        </form>
    )
  }

  //handles the changing privacy window
  const ChangePPrivacyWindow = (props) => {
    <form id='privacyButton'
        name='privacyButton'
        onSubmit={changePPrivacy}
        action="/changePPrivacy"
        method='POST'>
        <input type="submit" value="Change Privacy?" />
        <input id="_id" type="hidden" name='_id' value={post._id} />
        </form>
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

//loads the list of all the post
const loadPosts = () => {
    createRoot(document.getElementById('posts')).render(<PostList props={post}/>);
}

const init = () => {
    const changePassButton = document.getElementById('changePassword');
    const changeUsernameButton = document.getElementById('changeUsername');


    createRoot(document.getElementById('makePost')).render(<PostForm />);

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

    loadPosts();
};

window.onload = init;