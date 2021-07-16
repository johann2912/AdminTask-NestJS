FROM node:14.17.3-alpine3.12 as builder 

WORKDIR /source/build

COPY src ./src
COPY *.json ./

RUN npm i
RUN npm run build

FROM node:14.17.3-alpine3.12

WORKDIR /app

COPY --from=builder /source/build/node_modules ./node_modules
COPY --from=builder /source/build/dist ./dist
COPY --from=builder /source/build/*.json ./

EXPOSE 4015

CMD ["node", "dist/main"]