# Bancho Multiplayer Bot Statistics Website

Website for checking user statistics etc. for the Bancho Multiplayer Bot.

### Requirements

- [Bancho Multiplayer Bot](https://github.com/matte-ek/BanchoMultiplayerBot) by [matte-ek](https://github.com/matte-ek)
- [NodeJS](https://nodejs.org)  18 or higher
- [Redis](https://redis.io) server

### Installation

Run `npm install` to install the dependencies.

Copy the `.env.example` file to `.env` and configure it.

Run `npm build` to build the production build.

Run `npm start` to start the website.

You can use `PORT=1665 npm start` to change the port the website runs on.

### About

Built with [Next.JS](https://nextjs.org) with [T3](https://create.t3.gg) template.

Authentication with [NextAuth](https://next-auth.js.org/).

Component libraries:
- [ShadcnUI](https://ui.shadcn.com)
- [Tremor](https://tremor.so)