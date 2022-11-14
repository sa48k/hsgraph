import React from 'react'

const PlayerIcons = ({ p1, p2 }) => {
    return (
        <>
            <img class="heroicon" src={`/images/${p1.class}_icon.png`} />
            vs
            <img class="heroicon" src={`/images/${p2.class}_icon.png`} />
        </>
    )
}

export default PlayerIcons