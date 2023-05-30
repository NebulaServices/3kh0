FROM node:16
WORKDIR /app/3kh0
COPY ./ /app/3kh0
RUN npm install
EXPOSE 6003
CMD [ "node", "index.js" ]