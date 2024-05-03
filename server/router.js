const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);	

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/app', mid.requiresLogin, controllers.App.page);
  app.post('/app', mid.requiresLogin, controllers.App.makePost);

  app.get('/getUsername', mid.requiresLogin, controllers.Account.getUsername);
  app.post('/changePass', mid.requiresLogin, controllers.Account.changePass);
  app.post('/changeUsername', mid.requiresLogin, controllers.Account.changeUsername);
  app.get('/getUserPosts', mid.requiresLogin, controllers.App.getUserPosts);
  app.get('/getPublicPosts', mid.requiresLogout, controllers.App.getPublicPosts);

  app.post('/changePPrivacy', mid.requiresLogin, controllers.App.changePPrivacy);
  app.post('/editPost', mid.requiresLogin, controllers.App.editPost);
  app.post('/delete', mid.requiresLogin, controllers.App.deletePost);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('*', controllers.App.errPage);
};

module.exports = router;
