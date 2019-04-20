/* global TrelloPowerUp, moment, Pikaday */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();
var now = moment().toDate();
var snoozeTime = null;
var token = null;

var TIME_FORMAT = 'LT';

var setDays = function(t, habitTrackerDays) {
 return t.set('card', 'shared', 'habitTrackerDays', habitTrackerDays);
}

let selectedDates = [];

// Shows dates on the calendar
t.get('card', 'shared')
.then(function(shared) {
  if (shared.habitTrackerDays) {
    selectedDates = shared.habitTrackerDays;
  }
  
  // Set first day of week as Sunday (default) or Monday
  let firstDay = 0;
  
  if (shared.habitTrackerSettings && shared.habitTrackerSettings.firstDayOfWeek) {
      if (shared.habitTrackerSettings.firstDayOfWeek === 'MONDAY') {
        firstDay = 1;
      }
  }
  
  var picker = new Pikaday({
    bound: false,
    format: 'MM/DD/YYYY',
    defaultDate: now,
    setDefaultDate: now,
    enableSelectionDaysInNextAndPreviousMonths: true,
    container: document.getElementById('datepicker'),
    field: document.getElementById('date-input'),
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
}).catch(function(error) {
  console.log('Error: ', error);
});
  