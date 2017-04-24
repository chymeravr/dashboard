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

# nginx and uwsgi
RUN apt-get update
RUN apt-get install -y nginx
RUN pip install uwsgi

# Create logging directory
RUN mkdir /var/log/dashboard/

# Copy all the project files. Excluded files are present in .dockerignore
COPY requirements.txt $BASE/

WORKDIR $BASE
RUN pip install -r requirements.txt

COPY . $BASE/

# Pass DEBUG value as environment variable. Django debug mode depends on this
ENV DEBUG=$DEBUG

# Bootstrap dev server if required
RUN if [ "$DEBUG" = "True" ]; then bash devbootstrap.sh; fi

# nginx config
COPY server/dashboard_nginx.conf /etc/nginx/sites-enabled
COPY server/nginx.conf /etc/nginx/nginx.conf

CMD service nginx restart; uwsgi --ini $BASE/server/dashboard.ini

