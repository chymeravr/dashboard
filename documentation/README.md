# Reading resources

## JWT
- Cookies vs Tokens: https://auth0.com/blog/cookies-vs-tokens-definitive-guide/
- How to manually write: http://blog.apcelent.com/django-json-web-token-authentication-backend.html
- Library: djangorestframework-jwt http://getblimp.github.io/django-rest-framework-jwt/

## DRF (Django Rest Framework)
- http://www.django-rest-framework.org/

## ReactJS + Django
- http://geezhawk.github.io/using-react-with-django-rest-framework

1. `npm init`
2. `npm install --save-dev jquery react react-dom webpack webpack-bundle-tracker babel-loader babel-core babel-preset-es2015 babel-preset-react`
3. `mkdir -p assets/js`
4. `touch assets/js/index.js webpack.config.js`
5. `./node_modules/.bin/webpack --config webpack.config.js` Generate a bundle
6. `./node_modules/.bin/webpack --config webpack.config.js --watch &` Hot reload

