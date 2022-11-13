# hsgraph v0.9

Generate line graphs of heroes' HP over time in a Hearthstone replay.

Works on XML files downloaded from [hsreplay.net](https://hsreplay.net).

## Usage

Requires: Node, npm, Python3

- Run the Python script `hshpgraph.py` in a directory containing one or more XML files as downlaoded from HSReplay.net. The script will run and generate a `matchdata_xxxx.json` file. 
- Move this .json file to `frontend\public\data\`, renaming it to `matchdata.json`
- cd to the /frontend/ directory 
- `npm install` to install required dependencies (only needs to be done once)
- then `run npm start`
- Your graphs should open in your browser

## Features

- Generates graphs over time of each heroes' health in a Hearthstone replay. Tracks damage, healing, and (hopefully) armour.
- Supports Renathal - players start at 40HP if he is present in the deck.
- Supports Maestra of the Masquerade - correct class for each hero is shown, even if they start as another class)

## Limitations
* Only tested on standard ranked and casual games. Almost certainly won't work with most tavern brawls. Definitely won't work with any other game modes.
* Probably a lot of mistakes. Doesn't support OG Alexstrasza (set a Hero's health to 15), among other thigns.

