/* global TrelloPowerUp, moment */

window.Promise = TrelloPowerUp.Promise;
var util = require('./util.js');
var now = moment().toDate();
const timezone = moment.tz.guess();

// helper function to fetch data and generate card badges
var getBadge = function(t) {
  return t.get('card', 'shared')
  .then(function(data) {
    if (data.habitTrackerSettings && data.habitTrackerSettings.daysInWeek) {
      return getDates(t, data.habitTrackerUseComments, data.habitTrackerSettings, data.habitTrackerDays || [] ).then(dates => {
        const daysInWeek = parseInt(data.habitTrackerSettings.daysInWeek, 10);
        const firstDayOfWeek = data.habitTrackerSettings.firstDayOfWeek;
        const today = moment(now).tz(timezone);
        const yesterday = moment(now).tz(timezone).subtract(1, 'day');

        const streak = util.getStreak(today, dates, firstDayOfWeek, daysInWeek);
        const streakUntilYesterday = util.getStreak(yesterday, dates, firstDayOfWeek, daysInWeek);

        if (streakUntilYesterday > 0 && streakUntilYesterday > streak) {
          return [{
            text: `Streak: ${streakUntilYesterday}`,
            color: 'yellow'
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
      });
    }
  }).catch(function(error){
      console.log("Error getting badge", error);
      return [];
  });
};

var getDates = function(t, useComments, settings, days) {
  const commentFilter = settings.commentFilter || '';

  if (!useComments) {
    return new Promise.resolve(days);
  }
  var cardId = t.getContext().card;
  return t.get('member', 'private', 'authToken').then(function(token) {
    if (token) {
      const key = 'bd1e7e486269d148ecd1be71ad5a3f1a';
      return axios.get(`https://api.trello.com/1/cards/${cardId}/actions?filter=commentCard&key=${key}&token=${token}`)
        .then(function (response) {
          const daysSet = new Set();
          response.data.forEach(comment => {
            // Attempt at case insensitivity - I know this may not work for all languages but we'll see how it goes
            const upperCaseCommentText = comment.data.text.toUpperCase();
            const upperCaseCommentFilter = commentFilter.toUpperCase();

            if (upperCaseCommentText.includes(upperCaseCommentFilter)) {
              const date = moment(comment.date).tz(timezone).format('MM/DD/YYYY');
              daysSet.add(date);
            }
          });

          return t.set('card', 'shared', 'habitTrackerSettings', {...settings, commentDays: [...daysSet]}).then(() => {
            days.forEach(day => daysSet.add(day));
            return [...daysSet];
          });
        })
        .catch(function (error) {
          // In the case that a user has revoked this Power-up's access
          console.log('Error getting dates', error);
          t.set('member', 'private', 'authToken', undefined)
          t.set('card', 'shared', 'habitTrackerUseComments', false);
        })
        .finally(function () {
          // always executed
        });
    } else {
        // In the case that a user has revoked this Power-up's access
        t.set('member', 'private', 'authToken', undefined)
        t.set('card', 'shared', 'habitTrackerUseComments', false);
    }
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
        });
      }
    }];
  },
  'card-back-section': function(t, options) {
    return t.get('card', 'shared', 'habitTrackerSettings')
    .then(function(habitTrackerSettings) {
      if (habitTrackerSettings && habitTrackerSettings.daysInWeek) {  
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
},
{
  appKey: 'bd1e7e486269d148ecd1be71ad5a3f1a',
  appName: 'Streak - habit tracker'
});
