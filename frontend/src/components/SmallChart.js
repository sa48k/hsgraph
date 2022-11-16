import React from 'react'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Legend,
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Legend
);

function SmallChart({ match }) {
    if (match.length < 1) return null

    const unzip = arr => arr.reduce((acc, c) => (c.forEach((v, i) => acc[i].push(v)), acc), Array.from({ length: Math.max(...arr.map(a => a.length)) }, (_) => []));

    const classColours = {
        'Warrior': '#8E1002',
        'Shaman': '#0070DE',
        'Rogue': '#4C4D48',
        'Paladin': '#AA8F00',
        'Hunter': '#016E01',
        'Druid': '#703606',
        'Warlock': '#7624AD',
        'Mage': '#0092AB',
        'Priest': '#A7A17F',
        'Demon Hunter': '#193338',
    }

    // adjust a hex code to make it lighter (+ve amount) or darker (-ve amount)
    const adjustColour = (color, amount) => {
        return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
    }

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

    const labels = [...new Array(match.matchdata.length)].map((t, i) => Math.ceil(i / 2))

    const data = {
        labels,
        datasets: [
            {
                label: match.player1.name,
                lineTension: 0.3,
                pointRadius: 2,
                data: unzip(match.matchdata)[0],
                backgroundColor: classColours[match.player1.class],              // dots
                borderColor: adjustColour(classColours[match.player1.class], 75)     // lines
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

export default SmallChart