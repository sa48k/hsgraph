import React from 'react'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import Card from '@mui/material/Card'
import HPLineChart from './HPLineChart'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import PlayerIcons from './PlayerIcons'

const BigChartDialog = ({ match }) => {

    if (match === undefined) return <Card><h1>Loading...</h1></Card>

    // calculate the y-position of the two player class icons
    // the loser's icon will be at bottom="0%" (0 on the y-axis)
    // the winner's icon should be next to their final point on the chart
    const maxHP = Math.max(...match.matchdata.flat())
    const p1finalhp = match.matchdata.slice(-1)[0][0]
    const p2finalhp = match.matchdata.slice(-1)[0][1]
    const p1position = (p1finalhp / maxHP * 100 * 0.9).toString()
    const p2position = (p2finalhp / maxHP * 100 * 0.9).toString()
    // TODO: deal with overlap, maybe

    const footer = (tooltipItems) => {
        return 'honk'
    }

    const options = {
        responsive: true,
        interaction: {
            intersect: false,
            mode: 'nearest',
            axis: 'x'
        },
        plugins: {
            legend: {
                position: 'bottom'
            },
            tooltip: {
                callbacks: {
                    footer: footer,
                }
            }
        },
    };

    return (
        <Card sx={{ p: 6 }}>
            <Typography variant="h4" component="div">
                {match.player1.class} vs {match.player2.class}
            </Typography>
            <Grid container sx={{ height: "100%" }}>
                <Grid item xs={11}>
                    <HPLineChart match={match} options={options} />
                </Grid>
                <Grid item xs={1} p={1}>
                    <PlayerIcons match={match} p1position={`${p1position}%`} p2position={`${p2position}%`} />
                </Grid>
            </Grid>
            <Divider sx={{ m: 4 }} />
            <List>
                <ListItem>
                    <ListItemText primary={`Match Length: ${match.gamelength} minutes`} />
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component="a" href={match.url} target="_">
                        <ListItemText primary="View replay" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Typography variant="p" component="div">


            </Typography>
        </Card>
    )
}

export default BigChartDialog