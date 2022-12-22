import React from 'react'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import Stack from '@mui/material/Stack'
import Card from '@mui/material/Card'
import HPLineChart from './HPLineChart'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import Divider from '@mui/material/Divider'
import PlayerIcons from './PlayerIcons'

const BigChartDialog = ({ match, removeMatch, setDialogOpen }) => {

    if (match === undefined) return <Card><h1>Loading...</h1></Card>

    const d = new Date(match.timestamp)
    const opts = { month: "short", year: "numeric", day: "numeric", weekday: "short", hour: "2-digit", minute: "2-digit" }
    const ts = d.toLocaleDateString(undefined, opts)

    // calculate the y-position of the two player class icons
    // the loser's icon will be at bottom="0%" (0 on the y-axis)
    // the winner's icon should be next to their final point on the chart
    const maxHP = Math.max(...match.matchdata.flat())
    const winnerfinalhp = match.player1.winner ? match.matchdata.slice(-1)[0][0] : match.matchdata.slice(-1)[0][1]
    const loserfinalhp = match.player1.winner ? match.matchdata.slice(-1)[0][1] : match.matchdata.slice(-1)[0][0]
    const winnerposition = (winnerfinalhp / maxHP * 100 * 0.9).toString()
    const loserposition = (loserfinalhp / maxHP * 100 * 0.9).toString()
    // TODO: deal with overlap, maybe

    // Custom HTML for tooltip
    const getOrCreateTooltip = (chart) => {
        let tooltipEl = chart.canvas.parentNode.querySelector('div');

        if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
            tooltipEl.style.borderRadius = '3px';
            tooltipEl.style.color = 'white';
            tooltipEl.style.opacity = 1;
            tooltipEl.style.pointerEvents = 'none';
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.transform = 'translate(-50%, 0)';
            tooltipEl.style.transition = 'all .1s ease';
            tooltipEl.style.zIndex = "5"

            const table = document.createElement('table');
            table.style.margin = '0px';

            tooltipEl.appendChild(table);
            chart.canvas.parentNode.appendChild(tooltipEl);
        }

        return tooltipEl;
    };

    const externalTooltipHandler = (context) => {
        // Tooltip Element
        const { chart, tooltip } = context;
        const tooltipEl = getOrCreateTooltip(chart);

        // Hide if no tooltip
        if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
        }

        // Set Text
        if (tooltip.body) {
            const titleLines = tooltip.title || [];
            const bodyLines = tooltip.body.map(b => b.lines);

            const tableHead = document.createElement('thead');

            titleLines.forEach(title => {
                const tr = document.createElement('tr');
                tr.style.borderWidth = 0;

                const th = document.createElement('th');
                th.style.borderWidth = 0;
                const text = document.createTextNode(title);

                th.appendChild(text);
                tr.appendChild(th);
                tableHead.appendChild(tr);
            });

            const tableBody = document.createElement('tbody');
            bodyLines.forEach((body, i) => {
                const colors = tooltip.labelColors[i];

                const span = document.createElement('span');
                span.style.background = colors.backgroundColor;
                span.style.borderColor = colors.borderColor;
                span.style.borderWidth = '2px';
                span.style.marginRight = '10px';
                span.style.height = '10px';
                span.style.width = '10px';
                span.style.display = 'inline-block';

                const tr = document.createElement('tr');
                tr.style.backgroundColor = 'inherit';
                tr.style.borderWidth = 0;

                const td = document.createElement('td');
                td.style.borderWidth = 0;

                const text = document.createTextNode(body);

                td.appendChild(span);
                td.appendChild(text);
                tr.appendChild(td);
                tableBody.appendChild(tr);
            });

            const tableRoot = tooltipEl.querySelector('table');

            // Remove old children
            while (tableRoot.firstChild) {
                tableRoot.firstChild.remove();
            }

            // Add new children
            tableRoot.appendChild(tableHead);
            tableRoot.appendChild(tableBody);
        }

        const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

        // Display, position, and set styles for font
        tooltipEl.style.opacity = 1;
        tooltipEl.style.left = positionX + tooltip.caretX + 'px';
        tooltipEl.style.top = positionY + tooltip.caretY + 'px';
        tooltipEl.style.font = tooltip.options.bodyFont.string;
        tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
    };

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
                enabled: false,
                position: 'nearest',
                external: externalTooltipHandler
            }
        },
    };

    return (
        <Card sx={{ p: 6 }}>
            <Grid container justifyContent="space-between">
                <Grid item>
                    <Typography variant="h4" component="div">
                        {match.player1.class} vs {match.player2.class}
                    </Typography>
                </Grid>
                <Grid item>
                    <Chip color="secondary" variant="outlined" label={match.gametype.split(' ')[0]} sx={{ ml: 2 }}></Chip>
                    <Chip color="secondary" variant="outlined" label={match.gametype.split(' ')[1]} sx={{ mx: 2 }}></Chip>
                </Grid>
            </Grid>
            <Typography variant="caption" component="div">
                {ts}
            </Typography>

            <Grid container sx={{ height: "100%", my: 2 }}>
                <Grid item xs={11}>
                    <HPLineChart match={match} options={options} />
                </Grid>
                <Grid item xs={1} p={1}>
                    <PlayerIcons match={match} winnerposition={`${winnerposition}%`} loserposition={`${loserposition}%`} borderRadius={4} />
                </Grid>
            </Grid>

            {/* <Divider sx={{ m: 4 }} /> */}

            <Stack direction="row" spacing={2}>
                <ListItem>
                    <AccessTimeIcon sx={{ mr: 1 }} />
                    <ListItemText primary={`Match Length: ${match.gamelength} minutes`} />
                </ListItem>
                <ListItem>
                    <ListItemButton component="a" href={match.url} target="_">
                        <ListItemText sx={{ textDecoration: 'underline' }} primary="View replay" />
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton onClick={() => removeMatch(match.id)}>
                        <DeleteIcon sx={{ mr: 1 }} />
                        Delete Match Data
                    </ListItemButton>
                </ListItem>
            </Stack>

            <IconButton onClick={() => setDialogOpen(false)} fontSize="large" sx={{ position: "absolute", top: 15, right: 15 }}>
                <CloseIcon />
            </IconButton>

        </Card>
    )
}

export default BigChartDialog