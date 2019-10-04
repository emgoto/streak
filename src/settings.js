/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe({
  appKey: 'bd1e7e486269d148ecd1be71ad5a3f1a',
  appName: 'Streak - habit tracker'
});

var showForm = function(habitTrackerSettings, habitTrackerUseComments) {
  if (habitTrackerUseComments) {
    document.getElementById('auth-btn').classList.add('u-hidden');
    document.getElementById('filter-input').removeAttribute('disabled');
  }

  document.querySelectorAll("#settings_form [name='daysInWeek']")[0].value = habitTrackerSettings.daysInWeek;
  document.querySelectorAll("#settings_form [name='firstDayOfWeek']")[0].value = habitTrackerSettings.firstDayOfWeek;
  document.querySelectorAll("#settings_form [name='commentFilter']")[0].value = habitTrackerSettings.commentFilter || '';

  document.getElementById('disabled-form').classList.add('u-hidden');
  document.getElementById('enabled-form').classList.remove('u-hidden');
}


t.render(function () {
  t.get('card', 'shared')
  .then(function (shared) {
    if (shared.habitTrackerSettings && shared.habitTrackerSettings.daysInWeek) {
     showForm(shared.habitTrackerSettings, shared.habitTrackerUseComments);
    } else {
      document.getElementById('disabled-form').classList.remove('u-hidden');
    }
  }).catch(function (e) {
    console.log('Error rendering settings', e);
  }).finally(function () {
    t.sizeTo(document.body);
  });
});


// Stores settings in habitTrackerSettings when user presses save button
document.getElementById('save-btn').addEventListener('click', function(){
  
  const daysInWeek = document.querySelectorAll("#settings_form [name='daysInWeek']")[0].value;
  const firstDayOfWeek = document.querySelectorAll("#settings_form [name='firstDayOfWeek']")[0].value;
  const commentFilter = document.querySelectorAll("#settings_form [name='commentFilter']")[0].value;
  
  return t.set('card', 'shared', 'habitTrackerSettings', {daysInWeek, firstDayOfWeek, commentFilter})
  .then(function(){
    t.closePopup();
  }).catch(function(){
      // do nothing
  });
});

// Removes habitTrackerSettings when user presses remove button
document.getElementById('remove-btn').addEventListener('click', function(){
  return t.set('card', 'shared', 'habitTrackerSettings', null)
      .then(function(){
        t.closePopup();
      }).catch(function(){
          // do nothing
      });
});

// Brings up information modal when user clicks "How to use Streak"
document.getElementById('how-to-use').addEventListener('click', function(){
  return t.modal({
    url: './modal.html',
    height: 360,
    fullscreen: false,
    title: 'Streak - habit tracker'
  })
});

// Brings up information modal when user clicks "How to use Streak" on the enable screen
document.getElementById('how-to-use-before-enable').addEventListener('click', function(){
  return t.modal({
    url: './modal.html',
    height: 360,
    fullscreen: false,
    title: 'Streak - habit tracker'
  })
});


var updateUseCommentsVisiblity = function() {
  t.set('card', 'shared', 'habitTrackerUseComments', true);
  document.getElementById('auth-btn').classList.add('u-hidden');
  document.getElementById('filter-input').removeAttribute('disabled');
}

//Store authentication token privately
var authenticationSuccess = function() {
  t.set('member', 'private', 'authToken', Trello.token());
  updateUseCommentsVisiblity();
};

// Bring up authentication modal on click of button
document.getElementById('auth-btn').addEventListener('click', function(){
  t.get('member', 'private', 'authToken').then(function(token) {
    if (token) {
      // If already authorised on another card, skip the authorisation
      updateUseCommentsVisiblity();
    } else {
      Trello.authorize({
        type: "popup",
        name: "Streak - habit tracker",
        expiration: "never",
        success: authenticationSuccess,
        error: () => {},
      });
    }
  });
});


// Turns on Streak for this card
document.getElementById('enable-btn').addEventListener('click', function(){
  const habitTrackerSettings = {daysInWeek: 7, firstDayOfWeek: 'SUNDAY', commentFilter: ''}
  return t.set('card', 'shared', 'habitTrackerSettings', habitTrackerSettings)
  .then(function(){
    showForm(habitTrackerSettings, false);
  }).catch(function(){
      // do nothing
  }).finally(function () {
    t.sizeTo(document.body);
  });
});
