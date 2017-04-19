$(function(){ // start window onload
  // ======= EVENT LISTENERS =========
  // logout
  $('.logout-button').on('click', submitButtons.logoutForm);

  // register
  $('.register-button').on('click', submitButtons.registerValidate);

  // login
  $('.login-button').on('click', submitButtons.loginForm);
}); // end window onload

// ====== EVENT HANDLERS ========

var submitButtons = {
  logoutForm: function(){
    $('.logout').submit();
  },
  registerValidate: function(){
    var $username = $('#reg-username');
    var $password = $('#reg-password');
    if ($username.val() !== '' && $password.val() !== ''){
      $('.register').submit();
    } else if (($username.val() === '') && ($password.val() === '')) {
        submitButtons.addErrorClass('both')
    } else if ($username.val() === '') {
      submitButtons.addErrorClass('username');
    } else if ($password.val() === '') {
        submitButtons.addErrorClass('password');
    }
  },
  addErrorClass: function(input){
    var $username = $('#reg-username');
    var $password = $('#reg-password');
    var $error = $('.reg-error-message');
    if (input === 'username') {
      $username.addClass('form-validate');
      $error.html('<em>please provide a username!</em>');
    } else if (input === 'password') {
        $password.addClass('form-validate');
        $error.html('<em>please provide a password!</em>');
    } else if (input === 'both') {
        $username.addClass('form-validate');
        $password.addClass('form-validate');
        $error.html('<em>please provide a username and password!</em>');
    }
  },
  loginForm: function(){
    var $username = $('#login-username');
    var $password = $('#login-password');
    var $error = $('.login-error-message');
    if(($username.val() === '') && ($password.val() === '')){
      $username.addClass('form-validate');        $password.addClass('form-validate');
      $error.html('<em>please provide your username and password!</em>');
    } else if($username.val() === ''){
      $username.addClass('form-validate');
      $error.html('<em>please provide your username!</em>');
    } else if($password.val() === ''){
        $password.addClass('form-validate');
        $error.html('<em>please provide your password!</em>');
    } else {
        $('.login').submit();
    }
  }
}
