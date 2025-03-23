# XelaRelam Server Discord Bot

[![wakatime](https://wakatime.com/badge/user/914584c4-b453-420c-8563-b9efdd43947f/project/d21cdf46-b456-48b5-81c4-d7ef49697cfa.svg)](https://wakatime.com/badge/user/914584c4-b453-420c-8563-b9efdd43947f/project/d21cdf46-b456-48b5-81c4-d7ef49697cfa)

![Discord.js](https://img.shields.io/badge/discord.js-^14.16.3-orange)
![License: BSD-4-Clause](https://img.shields.io/badge/license-BSD--4--Clause-blue)
[![Maintainability](https://api.codeclimate.com/v1/badges/1ad44d56c93ab9cec95b/maintainability)](https://codeclimate.com/github/XelaRelam/Discord-Bot/maintainability)

## Overview

Welcome to the **XelaRelam Server Discord Bot**! This bot is specifically built for managing and automating tasks within the **XelaRelam** server. It is designed to help streamline community management, automate thread management, and integrate user bots, making the server a more organized and efficient place for development collaboration.

The bot is **open-source**, ensuring that it is fully transparent and trustworthy. You can inspect the code to verify its functionality and security, and it is built with **Discord.js** for a responsive and feature-rich experience.

## Features

- **Thread Management**: Automatically manage and organize threads.
- **User Bot Integration**: Manage user bots into the XelaRelam server.
- **Automated Server Tasks**: Run server-specific tasks like user tracking, etc.
- **Commands**: Commands tailored to the XelaRelam server’s development.
- **Server-Specific**: This bot is exclusive to the **XelaRelam** server.

## Installation (For Server Administrators)

If you're setting up a copy of this bot on your server, follow the steps below:

### Prerequisites

1. **Node.js** (v22 or above) — You can download it [here](https://nodejs.org/).
2. **Discord Bot Token** — Create a bot on the [Discord Developer Portal](https://discord.com/developers/applications), then get your bot token.

### Steps

1. Clone this repository:

   ```bash
   git clone https://github.com/XelaRelam/Discord-Bot.git
   cd Discord-Bot
   ```

2. Install the necessary dependencies:

   ```bash
   npm install
   ```

3. Set up your .env file with the required information:

   ```bash
   DISCORD_BOT_TOKEN=Client_Token
   DISCORD_CLIENT_ID=Client_DI
   DISCORD_GUILD_ID=Guild_ID
   DATABASE_URL="file:./<Your_DB>.db"
   ```

4. Run the bot:

   ```bash
   npm run start
   ```

5. Contributing

### Contributing

Although this bot is specific to the **XelaRelam** server, contributions are still welcome for improving its functionality and performance! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a pull request

### License

This project is licensed under the **BSD-4-Clause** License - see the [LICENSE](./LICENSE) file for details.

### Transparency

This bot is fully open-source, meaning you can freely review the code and ensure there are no hidden or malicious activities. As the bot is exclusive to the **XelaRelam** server, we maintain transparency within the community and ensure it’s fully secure.

---

For any questions or suggestions, feel free to open an issue or contribute to the repository!
