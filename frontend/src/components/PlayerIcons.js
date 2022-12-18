import React, { useContext } from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { positions } from '@mui/system';
import { MyContext } from '../App'

const adjustColour = (color, amount) => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

const PlayerIcons = ({ match, winnerposition = "", loserposition = "", borderRadius = 2 }) => {
    const classColours = useContext(MyContext)
    const winner = match.player1.winner === true ? match.player1 : match.player2
    const loser = match.player1.winner === true ? match.player2 : match.player1

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
                    sx={{ boxShadow: `0 0 0 ${borderRadius}px ${adjustColour(classColours[winner.class], 75)}, 0 0 0 ${borderRadius+2}px ${classColours[winner.class]}`  }}
                    position="absolute"
                    bottom={winnerposition} left="0px"
                />
            </Grid>

            <Grid item>
                <Box
                    component="img"
                    className="heroicon"
                    src={`/images/${loser.class}_icon.png`}
                    sx={{ boxShadow: `0 0 0 ${borderRadius}px ${adjustColour(classColours[loser.class], 75)}, 0 0 0 ${borderRadius + 2}px ${classColours[loser.class]}` }}
                    position="absolute"
                    bottom={loserposition} left="0px"
                />
            </Grid>

        </Grid>

    )
}

export default PlayerIcons

