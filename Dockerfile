FROM node:14.15.1-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh \
        python \
        make \
        g++


RUN mkdir -p app/code

WORKDIR /app/code/

COPY . .

RUN ls -l

RUN pwd

# To handle 'not get uid/gid'
# npm_config_unsafe_perm=true
RUN npm config set unsafe-perm true

RUN npm install --quiet node-gyp -g

RUN npm install

RUN npm run build

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3000

CMD  export NODE_ENV=$NODE_ENV && node . 

EXPOSE ${PORT}