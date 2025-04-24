# Skyblock-Bazaar-Flippidy

A fully automated ChatTriggers module for Hypixel Skyblock Bazaar Flipping. This module automates the process of buying and selling items in the Bazaar to generate profit.

## Features

- **Fully Automated Flipping**: Identifies the most profitable flips and executes them automatically
- **Multiple Concurrent Flips**: Can manage multiple buy and sell orders in parallel
- **In-Game UI**: User-friendly interface for control and monitoring
- **Market Manipulation Protection**: Avoids items that might be manipulated
- **Automatic Bazaar Opening**: Can open the Bazaar automatically using the /bz command
- **Debug Mode**: Detailed logging for troubleshooting and transparency

## Installation

### Prerequisites

1. **Minecraft** with Forge for version 1.8.9
2. **ChatTriggers** installed for Forge 1.8.9 (version 2.0 or higher)
3. Access to **Hypixel Skyblock**

### Installation Steps

1. **Install ChatTriggers** (if not already installed):
   - Download the latest version from [ChatTriggers](https://www.chattriggers.com/)
   - Place the .jar file in your Minecraft mods folder
   - Restart Minecraft

2. **Install Bazaar Flippidy**:
   - Open Minecraft and connect to Hypixel
   - Run the command `/ct import BazaarFlippidy`
   - Alternatively:
     - Download this repository as a ZIP
     - Extract it to your `.minecraft/config/ChatTriggers/modules/` folder
     - Run `/ct reload` in Minecraft

3. **First Use**:
   - Make sure you have enough coins for flipping
   - Run `/flippidy` to open the user interface
   - Go to the Bazaar or use `/bz` to open the Bazaar
   - Click "Start" in the UI or run `/flippidy start` to begin

## Usage

### Commands

- `/flippidy` or `/flip` - Opens the main user interface
- `/flippidy help` - Shows the help page with all commands
- `/flippidy start` - Starts automatic flipping
- `/flippidy stop` - Stops automatic flipping
- `/flippidy settings` - Shows the current settings
- `/fdebug` or `/flippidydebug` - Activates or deactivates debug mode

### User Interface

The user interface can be moved by clicking and dragging the title bar and offers the following functions:

- Display of current status
- List of active flips with profit information
- Start and stop buttons for control
- Collapse and expand the interface with the ▼/▶ button

### Optimal Settings

The default settings are suitable for most users but can be adjusted in the `config.js` file if needed:

- `minProfitPercentage`: Minimum profit margin in percent (default: 3%)
- `minProfitAmount`: Minimum profit amount in coins (default: 1000)
- `maxConcurrentFlips`: Maximum number of concurrent flips (default: 3)

## Safety Notes

- **Market Manipulation**: The module has protection against market manipulation which helps avoid risky flips.
- **API Rate Limits**: The module takes into account Hypixel API limitations to avoid temporary bans.
- **Minecraft ToS**: Use at your own risk. Make sure usage complies with Hypixel and Minecraft terms of service.

## Troubleshooting

- **UI not showing**: Try running `/ct reload` or restart Minecraft
- **Flipping won't start**: Check if you're in the Bazaar and the API access is working
- **API access errors**: Enable debug mode with `/fdebug` for more detailed error information

## Contributing

Contributions to the project are welcome! You can fork the project and submit pull requests to suggest improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.