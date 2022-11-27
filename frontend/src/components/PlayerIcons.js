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

const PlayerIcons = ({ match, p1position = "", p2position = "" }) => {
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
                    src={`/images/${match.player1.class}_icon.png`}
                    style={{ borderColor: classColours[match.player1.class] }}
                    position="absolute"
                    top={p1position} left="0px"
                />
            </Grid>
            <Grid item>
                <Box
                    component="img"
                    className="heroicon"
                    src={`/images/${match.player2.class}_icon.png`}
                    style={{ borderColor: classColours[match.player2.class] }}
                    position="absolute"
                    bottom={p2position} left="0px"
                />
            </Grid>
        </Grid>

    )
}

export default PlayerIcons

