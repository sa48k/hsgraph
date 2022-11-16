import React from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import Card from '@mui/material/Card'
import SmallChart from './SmallChart'
// import BigChart from './BigChart'
import PlayerIcons from './PlayerIcons'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

const GraphGridItems = ({ matches, setDialogOpen, setSelectedMatchID }) => {
    const opts = { month: "short", year: "numeric", day: "numeric", weekday: "short", hour: "2-digit", minute: "2-digit" }

    const handleCardClick = (e) => {
        setDialogOpen(true)
        setSelectedMatchID('42')
    }
    
    let graphcards = matches.map((match) => {
        const d = new Date(match.timestamp)
        const ts = d.toLocaleDateString(undefined, opts)
        return (
            <Grid key={match.id} item xs={12} md={6} lg={4}>
                <Card
                    onClick={() => setDialogOpen(true)}
                    style={{ cursor: 'pointer' }}
                    className="hvr-grow-shadow"
                    sx={{ p: 2, display: 'flex', flexDirection: 'column' }}
                >
                    <Typography component="h2" variant="h6" color="primary">{match.player1.class + ' vs ' + match.player2.class}</Typography>
                    <Typography variant="caption">
                        {ts}
                    </Typography>
                    <br />
                    <Grid container spacing={1}>
                        <Grid item xs={10}>
                            <SmallChart match={match} />
                        </Grid>
                        <Grid item xs={2} p={1}>
                            <PlayerIcons match={match} />
                        </Grid>
                    </Grid>

                </Card>
            </Grid>
        )
    })

    return graphcards
}

export default GraphGridItems