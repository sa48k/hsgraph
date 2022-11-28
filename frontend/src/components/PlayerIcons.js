import React from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { positions } from '@mui/system';


const classColours = {
    'Warrior': '#8E1002',
    'Shaman': '#0070DE',
    'Rogue': '#4C4D48',
    'Paladin': '#AA8F00',
    'Hunter': '#016E01',
    'Druid': '#703606',
    'Warlock': '#7624AD',
    'Mage': '#0092AB',
    'Priest': '#A7A17F',
    'Demon Hunter': '#193338',
} // todo: DRY

const adjustColour = (color, amount) => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

const PlayerIcons = ({ match, p1position = "", p2position = "" }) => {
    const winner = match.player1.winner ? match.player1 : match.player2
    const loser = match.player1.winner ? match.player2 : match.player1

    return (
        <Grid container
            direction="column"
            alignItems="center"
            sx={{ height: "100%" }}
            position="relative"
        >

            <Grid item>
                <Box
                    component="img"
                    className="heroicon"
                    src={`/images/${winner.class}_icon.png`}
                    sx={{ boxShadow: `0 0 0 3px ${adjustColour(classColours[winner.class], 75)}, 0 0 0 5px ${classColours[winner.class]}`  }}
                    position="absolute"
                    bottom={p1position} left="0px"
                />
            </Grid>

            <Grid item>
                <Box
                    component="img"
                    className="heroicon"
                    src={`/images/${loser.class}_icon.png`}
                    sx={{ boxShadow: `0 0 0 3px ${adjustColour(classColours[loser.class], 75)}, 0 0 0 5px ${classColours[loser.class]}` }}
                    position="absolute"
                    bottom={p2position} left="0px"
                />
            </Grid>

        </Grid>

    )
}

export default PlayerIcons

