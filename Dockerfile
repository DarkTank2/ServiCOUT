FROM node:lts

WORKDIR /home/node/app

COPY ./backend /home/node/app
COPY ./frontend/mobile/dist /home/node/app/public
COPY ./frontend/stationary/dist /home/node/app/public/stationary

RUN ["npm", "install"]

CMD ["npm", "run", "start"]