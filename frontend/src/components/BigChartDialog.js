import React from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'

const BigChartDialog = ({ matchData }) => {
    console.log("HOOOOONK", matchData)
    if (matchData === undefined) return <Card><h1>test</h1></Card>
    return (
        <Card sx={{ p: 4 }}>
            <Typography variant="h1" component="div">
               {matchData.id}
            </Typography>
        </Card>
    )
}

export default BigChartDialog