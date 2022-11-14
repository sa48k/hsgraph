import React from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import Paper from '@mui/material/Paper'
import Title from './Title'
import SmallChart from './SmallChart'
import PlayerIcons from './PlayerIcons'
import Typography from '@mui/material/Typography'

const GraphGridItems = (props) => {
    
    const opts = { month: "short", year: "numeric", day: "numeric", weekday: "short", hour: "2-digit", minute: "2-digit" }

    let graphcards = props.matches.map((match) => {
        const d = new Date(match.timestamp)
        const ts = d.toLocaleDateString(undefined, opts)
        return (
            <Grid key={match.id} item xs={12} sm={6} lg={4}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Title>{match.player1.class + ' vs ' + match.player2.class}</Title>
                    <Typography color="text.secondary" sx={{ flex: 1 }}>
                        {ts}
                    </Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={10}>
                            <SmallChart match={match} />
                        </Grid>
                        <Grid item xs={2} p={1}>
                            <PlayerIcons p1={match.player1} p2={match.player2} />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        )
    })

    return graphcards
}

export default GraphGridItems