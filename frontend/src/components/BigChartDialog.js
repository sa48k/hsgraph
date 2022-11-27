import React from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import HPLineChart from './HPLineChart'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import PlayerIcons from './PlayerIcons'

const BigChartDialog = ({ match }) => {
    
    if (match === undefined) return <Card><h1>Loading...</h1></Card>

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom'
            },
            title: {
                display: false,
                text: 'BIG GRAPH TITLE'
            },
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
                <Grid item xs={1} >
                    <PlayerIcons match={match} p1position="5%" p2position = "3%" />
                </Grid>
            </Grid>
            <Divider sx={{ m: 4 }} />
            <Typography variant="p" component="div">
                <strong>Match Length:</strong> {match.gamelength} minutes
            </Typography>
        </Card>
    )
}

export default BigChartDialog