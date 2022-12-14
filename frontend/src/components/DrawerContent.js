import React, { useState, useEffect, useContext } from 'react'
import Toolbar from '@mui/material/Toolbar'
import FileUploader from './FileUploader'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { MyContext } from '../App'

function DrawerContent({ matchesData, setMatchesData, filterOptions, setFilterOptions }) {
    const classColours = useContext(MyContext)

    return (
        <>
            <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: [1],
                }}
            >
            </Toolbar>

            <FileUploader matchesData={matchesData} setMatchesData={setMatchesData} />
            <Button color="secondary" variant="contained" component="span" sx={{ m: 2 }} onClick={() => setMatchesData([])}>
                Clear
            </Button>

            <FormControl sx={{ m: 2 }}>
                <InputLabel id="player-class-select-label">Player</InputLabel>
                <Select
                    labelId="player-class-select-label"
                    id="player-class-select"
                    value={filterOptions.player}
                    label="PlayerClass"
                    onChange={event => setFilterOptions({ ...filterOptions, player: event.target.value })}
                >
                    {Object.keys(classColours).sort().map((cl, idx) => 
                        <MenuItem key={idx} value={Object.keys(classColours)[idx]}>{cl}</MenuItem>
                    )}
                </Select>
            </FormControl>
            
            <FormControl sx={{ m: 2 }}>
                <InputLabel id="opponent-class-select-label">Opponent</InputLabel>
                <Select
                    labelId="opponent-class-select-label"
                    id="opponent-class-select"
                    value={filterOptions.opponent}
                    label="OpponentClass"
                    onChange={event => setFilterOptions({ ...filterOptions, opponent: event.target.value })}
                >
                    {Object.keys(classColours).sort().map((cl, idx) =>
                        <MenuItem key={idx} value={Object.keys(classColours)[idx]}>{cl}</MenuItem>
                    )}
                </Select>
            </FormControl>
           
        </>
    )
}

export default DrawerContent