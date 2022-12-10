import React, { useContext } from 'react'
import { MyContext } from '../App'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


function HPLineChart({ match, options }) {
    const classColours = useContext(MyContext)
    
    if (match.length < 1) return null

    // TODO: put this in useContext
    const unzip = arr => arr.reduce((acc, c) => (c.forEach((v, i) => acc[i].push(v)), acc), Array.from({ length: Math.max(...arr.map(a => a.length)) }, (_) => []));

    // This, too
    

    // and this
    // adjust a hex code to make it lighter (+ve amount) or darker (-ve amount)
    const adjustColour = (color, amount) => {
        return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
    }

    const labels = [...new Array(match.matchdata.length)].map((t, i) => Math.ceil(i / 2))

    const data = {
        labels,
        datasets: [
            {
                label: match.player1.name,
                lineTension: 0.3,
                pointRadius: 2,
                data: unzip(match.matchdata)[0],
                backgroundColor: adjustColour(classColours[match.player1.class], 75),                 // dots
                borderColor: classColours[match.player1.class],    // lines
            },
            {
                label: match.player2.name,
                lineTension: 0.3,
                pointRadius: 2,
                data: unzip(match.matchdata)[1],
                backgroundColor: classColours[match.player2.class],
                borderColor: adjustColour(classColours[match.player2.class], -75)
            },
        ],
    };
    return <Line options={options} data={data} />
}

export default HPLineChart