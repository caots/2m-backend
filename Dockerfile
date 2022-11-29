FROM node:16.13.1-alpine3.14 as builder
 
WORKDIR /app
 
COPY package.json package.json
RUN yarn
 
COPY . .
 
RUN yarn build
 
FROM node:16.13.1-alpine3.14 as runtime
 
WORKDIR /app

COPY --from=builder /app/.env /app/.env
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
 
CMD [ "node", "dist/main" ]