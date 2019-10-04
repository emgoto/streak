const path = require('path')

module.exports = {
  entry: {
    index: './src/index.js',
    calendar: './src/calendar.js',
    settings: './src/settings.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/docs/js'
  }
}



