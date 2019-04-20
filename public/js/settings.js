/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

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

// Stores settings in habitTrackerSettings when user presses save button
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