/* global TrelloPowerUp, moment */

var Pikaday = require('./pikaday.js');
var t = TrelloPowerUp.iframe();
var now = moment().toDate();

let selectedDates = [];
let commentDays = [];
let calendar = undefined;
let firstDay = 0; // first day of week as Sunday (default) or Monday
let commentFilter = '';

var setDays = function(t, habitTrackerDays) {
  return t.set('card', 'shared', 'habitTrackerDays', habitTrackerDays);
}

var isDayDisabled = function(day) {
    const formattedDate = moment(day).format('MM/DD/YYYY');
    return commentDays.includes(formattedDate);
}

var hasSettingsChanged = function(habitTrackerSettings, habitTrackerUseComments) {
  const newFirstDayofWeek = habitTrackerSettings.firstDayOfWeek === 'MONDAY' ? 1 : 0;
  if (newFirstDayofWeek !== firstDay) {
    return true;
  }

  const newCommentDays = habitTrackerSettings.commentDays || [];
  if (habitTrackerUseComments && !newCommentDays.every(day => commentDays.includes(day))) {
    return true;
  }

  const newCommentFilter = habitTrackerSettings.commentFilter || '';

  if (newCommentFilter !== commentFilter) {
    return true;
  }

  return false;
}

t.render(function () {
  t.get('card', 'shared')
    .then(function (shared) {
      const settingsHaveChanged = shared.habitTrackerSettings ? hasSettingsChanged(shared.habitTrackerSettings, shared.habitTrackerUseComments) : false;

      if (shared.habitTrackerDays) {
        selectedDates = shared.habitTrackerDays;
      }
      
      if (shared.habitTrackerSettings && shared.habitTrackerSettings.firstDayOfWeek) {
          if (shared.habitTrackerSettings.firstDayOfWeek === 'MONDAY') {
            firstDay = 1;
          } else {
            firstDay = 0;
          }
      }

      if (shared.habitTrackerUseComments) {
        commentDays = shared.habitTrackerSettings && shared.habitTrackerSettings.commentDays || [];
      }
    
      commentFilter = shared.habitTrackerSettings && shared.habitTrackerSettings.commentFilter || '';

      // We may need to re-create the calendar if certain settings have changed
      if (!calendar || settingsHaveChanged) {
        if (calendar) {
          calendar.destroy();
        }

        calendar = new Pikaday({
          bound: false,
          format: 'MM/DD/YYYY',
          defaultDate: now,
          setDefaultDate: now,
          enableSelectionDaysInNextAndPreviousMonths: true,
          container: document.getElementById('datepicker'),
          field: document.getElementById('date-input'),
          disableDayFn: isDayDisabled,
          firstDay,
          onSelect: (date) => {
              // Format selected date
              const formattedDate = moment(date).format('MM/DD/YYYY');
    
              // Remove date if it was previous selected
              if (selectedDates.includes(formattedDate)) {
                  selectedDates = selectedDates.filter((date) => date !== formattedDate);
              }
    
              // Otherwise add it to the selected dates
              else {
                  selectedDates.push(formattedDate);
              }     
            
              setDays(t, selectedDates);
          },
          selectDayFn: (date) => {
              // Check if a day is selected
              const formattedDate = moment(date).format('MM/DD/YYYY');
              return selectedDates.includes(formattedDate);
          },
        });
      } 
    }).catch(function (e) {
      console.log('Error rendering calendar', e)
      // do nothing
    }).finally(function () {
      t.sizeTo(document.body);
    });
});
