FROM ruby:latest
WORKDIR /usr/app
COPY Gemfile .
RUN bundle install
COPY . .
EXPOSE 3000
CMD ["ruby", "server.rb"]