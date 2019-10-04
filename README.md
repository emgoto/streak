# README

Streak is a Trello Power-up to track your habits!

![Streak example](https://emgoto.github.io/streak-test/img/streak-example.png)

## Accessing this Power-Up

This Power-Up's docs folder is published using Github Pages and can be accessed from this URL: https://emgoto.github.io/streak-test/ You'll need to put that link in your Trello Power-ups admin page.

## Testing the power-up locally with Jekyll and ngrok

Github pages uses Jekyll so you'll need to do a few things to test this locally:

```
gem install github-pages
jekyll serve
./ngrok http 4000 #in another terminal window
```
[See a full explanation here](https://www.emgoto.com/testing-trello-power-ups-on-github-pages/)

## Pushing your changes

Make sure to run `npm run build` before pushing changes. This will use the settings in `webpack.config.js` and put your js files into the `docs/js` folder.

We use docs instead of public as this is a limitation of the way Github Pages works.