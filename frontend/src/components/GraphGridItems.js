import React from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import Card from '@mui/material/Card'
import HPLineChart from './HPLineChart'
import PlayerIcons from './PlayerIcons'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

const GraphGridItems = ({ matches, setDialogOpen, setSelectedMatchID }) => {
    const opts = { month: "short", year: "numeric", day: "numeric", weekday: "short", hour: "2-digit", minute: "2-digit" }

    const handleCardClick = (id) => {
        setSelectedMatchID(id)
        setDialogOpen(true)
    }
    
    // sort by date (newest first)
    const sortedMatches = matches.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // options for the simple line graph displayed on each card
    const options = {
        responsive: true,
        scales: {
            x: {

            }
        },
        plugins: {
            legend: {
                position: 'bottom',
                onClick: (e) => e.stopPropagation()
            }
        },
        tooltips: { enabled: false },
        hover: { mode: null },
    }

    let graphCards = sortedMatches.map((match) => {
        const d = new Date(match.timestamp)
        const ts = d.toLocaleDateString(undefined, opts)
        return (
            <Grid key={match.id} item xs={12} md={6} lg={4}>
                <Card
                    onClick={() => handleCardClick(match.id)}
                    style={{ cursor: 'pointer' }}
                    className="hvr-grow-shadow"
                    sx={{ p: 2, display: 'flex', flexDirection: 'column' }}
                >
                    <Typography component="h2" variant="h6" color="primary">{match.player1.class + ' vs ' + match.player2.class}</Typography>
                    <Typography variant="caption">
                        {ts}
                    </Typography>

                    <Grid container padding={1} sx={{ height: "100%" }}>
                        <Grid item xs={10}>
                            <HPLineChart match={match} options={options} />
                        </Grid>
                        <Grid item xs={2} pl={1}>
                            <PlayerIcons match={match} p1position="-10%" p2position="25%"/>
                        </Grid>
                    </Grid>

                </Card>
            </Grid>
        )
    })

    return graphCards
}

export default GraphGridItems