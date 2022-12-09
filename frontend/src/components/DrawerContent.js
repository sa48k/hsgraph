import React, { useState, useEffect } from 'react'
import Toolbar from '@mui/material/Toolbar'
import FileUploader from './FileUploader'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function DrawerContent({ matchesData, setMatchesData }) {
    const handleChange = (event) => {
        
    }

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
                <InputLabel id="demo-simple-select-label">Class</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={3}
                    label="Age"
                    onChange={handleChange}
                >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl>
           
        </>
    )
}

export default DrawerContent