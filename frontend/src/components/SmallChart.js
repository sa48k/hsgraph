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
import { integerPropType } from '@mui/utils';

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

    const adjustColour = (color, amount) => {
        return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            }
        },
        scales: {

            x: {
                ticks: {
                    callback: function (value, index, ticks) {
                        console.log(index)
                        if (value / 2 !== Math.ceil(index / 2) | index === 0) {
                            return Math.ceil(index / 2)
                        } else {
                            return ''
                        }
                    }
                }
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