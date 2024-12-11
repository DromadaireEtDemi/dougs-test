# Build stage
FROM node:20.9.0-alpine AS builder
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
RUN yarn cache clean
COPY . .
RUN yarn build


# Production stage
FROM node:20.9.0-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json /usr/src/app/yarn.lock ./
EXPOSE 3000
CMD ["yarn", "start:prod"]
