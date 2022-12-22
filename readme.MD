# hsgraph v0.9
Generate line graphs of heroes' HP over time in a Hearthstone replay.

Works on XML files downloaded from [hsreplay.net](https://hsreplay.net).

## Usage
Requires: Node, npm, Python3

- Install all Python modules from requirements.txt in the `api` directory
- cd to the `/frontend` directory then `npm install` to install required dependencies (only needs to be done once)
- then `run npm start`; the site should open in your browser
- Click 'Upload XML' to upload your XML file(s). The backend will process them and send them to the frontend in the form of pretty graphs

## Features
- Generates graphs over time of each heroes' health in a Hearthstone replay. Tracks damage, healing, and armour.
- Supports Renathal - players start at 40HP if he is present in the deck.
- Supports Maestra of the Masquerade - correct class for each hero is shown, even if they start as another class)

## Limitations
* Only tested on standard and wild ranked and casual games. Almost certainly won't work with most tavern brawls. Definitely won't work with any other game modes.
* Tons of bugs. Doesn't support OG Alexstrasza (set a Hero's health to 15), among many other things.
