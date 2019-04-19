/* global TrelloPowerUp, moment, Pikaday */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();
var now = moment().toDate();
var snoozeTime = null;
var token = null;

var TIME_FORMAT = 'LT';

// Show remove button and currently stored values if habitTrackerSettings exists
t.get('card', 'shared', 'habitTrackerSettings')
.then(function(habitTrackerSettings) {
  if (habitTrackerSettings) {
    document.getElementById('remove-btn').classList.remove('u-hidden');
        
    document.querySelectorAll("#settings_form [name='daysInWeek']")[0].value = habitTrackerSettings.daysInWeek;
    document.querySelectorAll("#settings_form [name='firstDayOfWeek']")[0].value = habitTrackerSettings.firstDayOfWeek;
  }
}).catch(function(){
     // do nothing
  });

// Stores in habitTrackerSettings when press save button
document.getElementById('save-btn').addEventListener('click', function(){
  
  const daysInWeek = document.querySelectorAll("#settings_form [name='daysInWeek']")[0].value;
  const firstDayOfWeek = document.querySelectorAll("#settings_form [name='firstDayOfWeek']")[0].value;
  
  return t.set('card', 'shared', 'habitTrackerSettings', {daysInWeek, firstDayOfWeek})
  .then(function(){
    t.closePopup();
  }).catch(function(){
      // do nothing
  });
});

// Remove habitTrackerSettings when press remove button
document.getElementById('remove-btn').addEventListener('click', function(){
  return t.set('card', 'shared', 'habitTrackerSettings', null)
        .then(function(){
          t.closePopup();
        }).catch(function(){
            // do nothing
        });
});

// Bring up information modal when user clicks "How to use Streak"
document.getElementById('how-to-use').addEventListener('click', function(){
  return t.modal({
    url: './modal.html',
    height: 500,
    fullscreen: false,
    // optional function to be called if user closes modal (via `X` or escape, etc)
    callback: () => console.log('Goodbye.'),
    // optional title for header chrome
    title: 'Streak - habit tracker'
    // optional action buttons for header chrome
    // max 3, up to 1 on right side
  })
});