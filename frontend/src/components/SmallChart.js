import React from 'react'
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
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
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

    const newShade = (hexColor, magnitude) => {
        hexColor = hexColor.replace(`#`, ``);
        if (hexColor.length === 6) {
            const decimalColor = parseInt(hexColor, 16);
            let r = (decimalColor >> 16) + magnitude;
            r > 255 && (r = 255);
            r < 0 && (r = 0);
            let g = (decimalColor & 0x0000ff) + magnitude;
            g > 255 && (g = 255);
            g < 0 && (g = 0);
            let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
            b > 255 && (b = 255);
            b < 0 && (b = 0);
            return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
        } else {
            return hexColor;
        }
    }
    
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            }
        }
    }

    const labels = Array.from({ length: match.matchdata.length }, (_, i) => i + 1)
    const data = {
        labels,
        datasets: [
            {
                label: match.player1.name,
                lineTension: 0.3,
                pointRadius: 2,
                data: unzip(match.matchdata)[0],
                backgroundColor: classColours[match.player1.class],              // dots
                borderColor: newShade(classColours[match.player1.class], 30)     // lines
            },
            {
                label: match.player2.name,
                lineTension: 0.3,
                pointRadius: 2,
                data: unzip(match.matchdata)[1],
                backgroundColor: classColours[match.player2.class],
                borderColor: newShade(classColours[match.player2.class], -10)
            },
        ],
    };
    return <Line options={options} data={data} />
}

export default SmallChart