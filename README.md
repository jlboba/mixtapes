# PROJECT: MIXTAPES
**LIVE SITE:** https://project-mixtapes.herokuapp.com/

**SUMMARY:** Mixtapes is an app that lets you create music playlists with YouTube videos. 

# APPROACH
**TECHNOLOGY USED:** HTML/EJS, CSS, JavaScript/jQuery/isotope, MongoDB/Mongoose, Node.js, Express 

**DESCRIPTION:** 
- Mixtapes is a full-stack, sessions based, four model CRUD app build with MVC file organization
  - Models: User (full CRUD), Playlist (full CRUD), Song, Comment 
  - Several layers of interconnectivity amongst all four models 
- User Stories:
  - All users can view playlists and user profiles 
  - Only registered and logged in users can create/edit/comment on/like playlists and edit/delete accounts
  - App is sessions based so that users can only edit/delete playlists that they've made, as well as only allowing them to edit/delete their own account
 - Design:
   - HTML/CSS all done personally, no frameworks used 
   - App is relatively responsive
   - Isotope used for filtering playlists by creator 

# ETC.
**PLANNED FEATURES:** 
- Instead of filtering by users, I originally wanted to allow users to tag their playlists (e.g. rock, pop, indie) and have the playlists index page sort by user-created tags
- Giving commenters the ability to delete or edit their comment, as well as allowing anonymous/guest comments from non-registered users
- Better UI design, it looks quite large right now and the responsiveness is not the most robust
- Also originally wanted to look into YouTube or Spotify API to make the user experience much friendlier when it comes to actually listening to the playlists 

**CREDITS:** 
- isotope jQuery filtering http://isotope.metafizzy.co/filtering.html 
