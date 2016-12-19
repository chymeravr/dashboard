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

# Setup postgres on an Ubuntu 16.04
1. `sudo apt-get install postgresql postgresql-contrib`
2. To start setting up: `sudo -u postgres psql postgres`
3. `\password postgres`
4. DB User: ciportaluser, DB: ciportal, Password: SJ Students. Instructions https://www.digitalocean.com/community/tutorials/how-to-use-postgresql-with-your-django-application-on-ubuntu-14-04
5. Add to `/etc/postgresql/9.5/main/pg_hba.conf` : `host    all             all             0.0.0.0/0                 md5`
6. Add to `/etc/postgresql/9.5/main/postgresql.conf` : `listen_addresses = 'localhost, 10.1.0.4'` (Replace with hostname)


# Django PSQL settings
1. Install `libpq-dev`
2. Run requirements.txt installation
3. In django app, makemigrations and run migrate



