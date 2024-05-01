const helper = require('./helper.js');
const React  = require('react');
const {createRoot} = require('react-dom/client');

//handles login and sendPost
const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if (!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass});
    return false;
};

//handles the sign up and sendPost
const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!username || !pass || !pass2) {
        helper.handleError('All fields required!');
        return false;
    }

    if (pass !== pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, { username, pass, pass2});

    return false;
};

//handles login window
const LoginWindow = (props) => {
    return (
        <form id="loginForm"
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm">

            <label htmlFor="username">Username: </label>
            <input id="user" type='text' name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <input className="formSubmit" type="submit" value="Sign In" />
        </form>
    );
};

//handles signup window
const SignupWindow = (props) => {
    return (
        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm">
            <label htmlFor="username">Username: </label>
            <input id="user" type='text' name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass2">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input className="formSubmit" type="submit" value="Sign Up" />
        </form>
    );
};

//handles lists of all the posts in public spaces
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
                    <h3 id="message">{post.post}</h3>
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
  

  //loads all public posts
const loadPosts = () => {
    createRoot(document.getElementById('posts')).render(<PostList />);
}

const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    const root = createRoot(document.getElementById('loginSignUp'));

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <LoginWindow />);
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <SignupWindow />);
        return false;
    });

    loadPosts();
}

window.onload = init;