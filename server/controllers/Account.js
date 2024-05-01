const models = require('../models');

const { Account } = models;
const { Post } = models;

const loginPage = (req, res) => res.render('login');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/app' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/app' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  }
};

//gets the username of the user that is logged in
const getUsername = (req,res) => {
  Account.getUsername(req.session.account._id, (err,doc) => {
    if(err){
      return res.status(400).json({ error: 'Could not get username'});
    }

    return res.json({ username: doc });
  });
};

//changes the username of the user that is logged in
const changeUsername = async (req, res) => {
  console.log(req.body);
  const newUsername = `${req.body.newUser}`;
  const oldUsername = `${req.body.oldUsername}`;

  if (!newUsername) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  try {
    await Account.changeUsername(req.session.account._id, newUsername);
    await Post.updateUsername(oldUsername, newUsername);
    return res.status(200).json({ error: 'Username successfully updated' });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error has occured!' });
  }
};

//changes the password of the current user
const changePass = async (req,res) => {
  const newPass = `${req.body.newPass}`;
  const newPass2 = `${req.body.newPass2}`;

  if(!newPass || !newPass2) {
    return res.status(400).json({ error: 'All fields are required!'});
  }

  if(newPass !== newPass2) {
    return res.status(400).json({ error: 'New passwords do not match!'});
  }

  const oldPass = await Account.getCurrentPassword(req.session.account._id);
  const newPassHash = await Account.generateHash(newPass);  

  if(oldPass === newPass) {
    return res.status(400).json({ error: 'Old and new passwords do not match!'});
  }

  await Account.changePass(req.session.account._id, newPass, newPassHash);
  return res.status(200).json({ error: 'Password successfully updated'});
}

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  getUsername,
  changeUsername,
  changePass,
};
