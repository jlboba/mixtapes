$(function(){ // start window onload
  // ======= EVENT LISTENERS =========
  // -------- users
  // logout
  $('.logout-button').on('click', submitButtons.logoutForm);

  // register
  $('.register-button').on('click', submitButtons.registerValidate);

  // login
  $('.login-button').on('click', submitButtons.loginForm);

  // edit user
  $('.user-edit-button').on('click', submitButtons.userEditForm);

  // delete user
  $('.user-delete-button').on('click', submitButtons.userDeleteForm);

  // ------ playlists
  // create playlist
  $('.new-playlist-button').on('click', submitButtons.newPlaylistForm);

  // edit playlist
  $('.edit-playlist-button').on('click', submitButtons.editPlaylistForm);

  // ===== ISOTOPE METAFIZZY (isotope.metafizzy.co) =======
  // initialize isotope
    var $container = $('.playlists-index-container').isotope({
      itemSelector: '.playlists-card',
      layoutMode: 'fitRows',
      fitRows: {
        gutter: 15
      }
    });
    // event listener
    $('.filter-playlists').on('click', function(){
      var filterValue = $(this).attr('data-filter');
      $container.isotope({filter: filterValue});
    });
    // changes what button is checked
    $('.filter-playlists-nav').each( function( i, buttonGroup ) {
      var $buttonGroup = $(buttonGroup);
      $buttonGroup.on('click', 'a', function() {
        $buttonGroup.find('.is-checked').removeClass('is-checked');
        $(this).addClass('is-checked');
      });
    });

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
  },
  userEditForm: function(){
    var $password = $('#user-edit-password');
    var $error = $('.user-edit-error-message');
    if($password.val() === ''){
      $password.addClass('form-validate');
      $error.html('<em>please provide either your old password or create a new one!</em>');
    } else {
      $('.user-edit').submit();
    }
  },
  userDeleteForm: function(){
    $('.user-delete-form').submit();
  },
  newPlaylistForm: function(){
    var $title = $('#new-playlist-title');
    var $error = $('.new-playlist-error-message');
    if($title.val() === ''){
      $title.addClass('form-validate');
      $error.html('<em>please provide a title for the playlist!');
    } else {
      $('.new-playlist').submit();
    }
  },
  editPlaylistForm: function(){
    var $title = $('#edit-playlist-title');
    var $error = $('.edit-playlist-error-message');
    if($title.val() === ''){
      $title.addClass('form-validate');
      $error.html('<em>please provide a title for the playlist!');
    } else {
      $('.edit-playlist').submit();
    }
  }
}
