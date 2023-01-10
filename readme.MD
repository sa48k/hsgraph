# hsgraph v0.9
Generate line graphs of heroes' HP over time in a Hearthstone replay.

Works on XML files downloaded from [hsreplay.net](https://hsreplay.net).

## Installation
Requires: Node.js, npm, Python3

- Activate the virtual environment in `/venv`, then install all Python modules from `api/requirements.txt`
- cd to the `/frontend` directory then `npm install` to install required dependencies (only needs to be done once)

## Usage
- backend: Activate the virtual environment in `/venv`, cd to `api` directory, then `flask run`
- frontend: cd to `frontend` then `npm run start`; the site should open in your browser
- Click 'Upload XML' to upload your XML file(s). The backend will process them and send them to the frontend in the form of pretty graphs

## Features
- Generates graphs over time of each heroes' health in a Hearthstone replay. Tracks damage, healing, and armour.
- Supports Renathal - players start at 40HP (pre-nerf) or 35HP (post-nerf) if present in the deck. 
- Supports Maestra of the Masquerade - correct class for each hero is shown, even if they start as another class, *unless* Rogue is never revealed.

## Limitations
- Only tested on standard and wild ranked and casual games. 
- Doesn't support OG Alexstrasza (set a Hero's health to 15), among many other things. 
- Tons of bugs. 
