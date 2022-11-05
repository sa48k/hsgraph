import React from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Title from './Title'
import SmallChart from './SmallChart'
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
                    <SmallChart match={match} />
                </Paper>
            </Grid>
        )
    })

    return graphcards
}

export default GraphGridItems