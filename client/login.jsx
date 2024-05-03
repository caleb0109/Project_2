const helper = require('./helper.js');
const React  = require('react');
const {useState, useEffect} = React;
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

const PostList = (props) => {
    const [posts, setPosts] = useState(props.posts);

    useEffect(() => {
        const loadPostsFromServer = async () => {
            const response = await fetch('/getPublicPosts');
            const data = await response.json();
            setPosts(data.posts);
        };
        loadPostsFromServer();
    });

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

            </div>
        );
    });
    return (
        <div className="postArea">
            {postNodes}
        </div>
    );
  };

//handles lists of all the posts in public spaces
//loads the list of all the post
const App = () => {
    return (
        <div>
            <div id="postArea">
                <PostList posts={[]}/>
            </div>
        </div>
    );
};
  
const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    const root = createRoot(document.getElementById('loginSignUp'));
    const postRoot = createRoot(document.getElementById('publicPosts'));

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

    postRoot.render(<App />);
}

window.onload = init;