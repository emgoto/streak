/* global TrelloPowerUp, moment */

window.Promise = TrelloPowerUp.Promise;
var now = moment().toDate();
const timezone = moment.tz.guess();

// helper function to fetch data and generate card badges
var getBadge = function(t) {
  return t.get('card', 'shared')
  .then(function(data) {
  if (data.habitTrackerDays) {
    
    // CONSTANTS
    const DAYS_IN_WEEK = data.habitTrackerSettings.daysInWeek;
    const FIRST_DAY_OF_WEEK = data.habitTrackerSettings.firstDayOfWeek;
    const today = moment(now).tz(timezone);
    const yesterday = moment(now).tz(timezone).subtract(1, 'day');

    const streak = this.getStreak(today, data.habitTrackerDays, FIRST_DAY_OF_WEEK, DAYS_IN_WEEK);

    const fire_icon = `${window.location}img/fire_icon.png`;

    const streakUntilYesterday = this.getStreak(yesterday, data.habitTrackerDays, FIRST_DAY_OF_WEEK, DAYS_IN_WEEK);
  
    if (streakUntilYesterday > 0 && streakUntilYesterday > streak) {
      return [{
        text: `Streak: ${streakUntilYesterday}`,
        color: 'yellow'
      }];
    // If streak is 7 or more, include fire emoji
    } else if (streak > 6) {
      return [{
        icon: fire_icon,
        text: `Streak: ${streak}`,
        color: 'green'
      }]; 
    } else if (streak > 0) {
      return [{
        text: `Streak: ${streak}`,
        color: 'green'
      }]; 
    }
    return [{
      text: `Streak: 0`,
      color: 'grey'
    }];

  }

  }).catch(function(){
      return [];
  });
};

// We need to call initialize to get all of our capability handles set up and registered with Trello
TrelloPowerUp.initialize({
  'card-badges': function(t){
    return getBadge(t);
  },
  'card-buttons': function(t, opts) {
    // check that viewing member has write permissions on this board
    if (opts.context.permissions.board !== 'write') {
      return [];
    }
    return [{
      icon: `${window.location}img/icon.svg`,
      text: 'Streak',
      callback: function(context) {
        return context.popup({
          title: 'Streak Settings',
          url: './settings.html',
          height: 175
        });
      }
    }];
  },

  'card-back-section': function(t, options){
    return t.get('card', 'shared', 'habitTrackerSettings')
      .then(function(habitTrackerSettings) {
      if (habitTrackerSettings) {  
        return {
          title: 'Streak',
          icon: `${window.location}img/icon.svg`, // 16px no padding
          content: {
            type: 'iframe',
            url: t.signUrl('./calendar.html'),
            height: 280 // Max height is 500
        }  
          };
      }
    });
  }
});
