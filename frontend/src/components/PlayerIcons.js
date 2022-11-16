import React from 'react'

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
} // todo: DRY

const PlayerIcons = ({ match }) => {
    return (
        <>
            <img
                className="heroicon"
                src={`/images/${match.player1.class}_icon.png`}
                style={{ borderRadius: 100, border: '2.5px solid', borderColor: classColours[match.player1.class] }}
            />
            <img
                className="heroicon"
                src={`/images/${match.player2.class}_icon.png`}
                style={{ borderRadius: 100, border: '2.5px solid red', borderColor: classColours[match.player1.class] }}
            />
        </>
    )
}

export default PlayerIcons

