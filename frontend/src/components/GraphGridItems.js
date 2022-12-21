import React from 'react'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Card from '@mui/material/Card'
import HPLineChart from './HPLineChart'
import PlayerIcons from './PlayerIcons'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

const GraphGridItems = ({ matchesData, setDialogOpen, setSelectedMatchID, filterOptions }) => {
    const datetimeoptions = { month: "short", year: "numeric", day: "numeric", weekday: "short", hour: "2-digit", minute: "2-digit" }

    const handleCardClick = (id) => {
        setSelectedMatchID(id)
        setDialogOpen(true)
    }

    const getWinMargin = (match) => Math.abs(match.matchdata.slice(-1)[0][0] - match.matchdata.slice(-1)[0][1])

    // apply filter options, poorly
    if (filterOptions.player !== 'All') {
        var sortedMatches = matchesData.filter(match => match.player1.class === filterOptions.player || match.player2.class === filterOptions.player)
    } else {
        var sortedMatches = matchesData
    }

    if (filterOptions.opponent !== 'All') {
        var sortedMatches = sortedMatches.filter(match => match.player1.class === filterOptions.opponent || match.player2.class === filterOptions.opponent)
    }

    if (filterOptions.sortFilter === 'Newest first') var sortedMatches = sortedMatches.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    if (filterOptions.sortFilter === 'Oldest first') var sortedMatches = sortedMatches.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    if (filterOptions.sortFilter === 'Win margin') var sortedMatches = sortedMatches.sort((a, b) => getWinMargin(b) - getWinMargin(a))

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
        const ts = d.toLocaleDateString(undefined, datetimeoptions)
        // const winner = match.player1.winner === true ? match.player1 : match.player2 // use to apply checkmark or cross on icons for a11y

        return (
            <Grid key={match.id} item xs={12} md={6} xl={4}>
                <Card
                    onClick={() => handleCardClick(match.id)}
                    style={{ cursor: 'pointer' }}
                    className="hvr-grow-shadow graphcard"
                    sx={{ p: 2, display: 'flex', flexDirection: 'column' }}
                >
                    <Grid container justifyContent="space-between">
                        <Grid item>
                        <Typography component="h2" variant="h6" color="primary">
                            {match.player1.class + ' vs ' + match.player2.class}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Chip size="small" color="secondary" variant="outlined" label={match.gametype.split(' ')[0]} sx={{ ml: 1 }}></Chip>
                            <Chip size="small" color="secondary" variant="outlined" label={match.gametype.split(' ')[1]} sx={{ mx: 1 }}></Chip>
                        </Grid>
                    </Grid>
                    <Typography variant="caption">
                        {ts}
                    </Typography>

                    <Grid container padding={1} sx={{ height: "100%" }}>

                        <Grid item xs={10}>
                            <HPLineChart
                                match={match}
                                options={options}
                            />
                        </Grid>

                        <Grid item xs={2} pl={3}>
                            <PlayerIcons
                                match={match}
                                winnerposition="75%"
                                loserposition="30%"
                            />
                        </Grid>

                    </Grid>

                </Card>
            </Grid>
        )
    })

    return graphCards
}

export default GraphGridItems