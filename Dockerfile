FROM ubuntu:16.04

ENV BASE=/home/dashboard

# Build argument to build a debug image if required (pass DEBUG=True in --build-args)
ARG DEBUG

RUN mkdir $BASE

RUN apt-get update

# Common system tools
RUN apt-get install -y vim curl python-pip python-software-properties
RUN pip install --upgrade pip

# Postgres
RUN apt-get install -y libpq-dev 

# npm
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs
RUN npm install jquery react react-dom webpack webpack-bundle-tracker babel-loader babel-core babel-preset-es2015 babel-preset-react
RUN npm install -g gulp

# nginx and uwsgi
RUN apt-get install -y nginx
RUN pip install uwsgi

# Create logging directory
RUN mkdir /var/log/dashboard/

# Copy all the project files. Excluded files are present in .dockerignore
COPY package.json $BASE/
COPY requirements.txt $BASE/
COPY semantic $BASE/

WORKDIR $BASE/semantic
RUN gulp build

WORKDIR $BASE
RUN npm install
RUN pip install -r requirements.txt

COPY . $BASE/

# Pass DEBUG value as environment variable. Django debug mode depends on this
ENV DEBUG=$DEBUG

# Bootstrap dev server if required
RUN if [ "$DEBUG" = "True" ]; then bash devbootstrap.sh; fi

# Build js bundles
WORKDIR $BASE/dashboard

RUN ../node_modules/.bin/webpack --config webpack.config.js
WORKDIR $BASE

# collect static files
RUN python manage.py collectstatic --noinput  

# nginx config
COPY server/dashboard_nginx.conf /etc/nginx/sites-enabled

CMD service nginx restart; uwsgi --ini $BASE/server/dashboard.ini

