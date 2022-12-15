import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextareaAutosize from '@mui/base/TextareaAutosize'

function FileUploader({ setMatchesData }) {
    const [modalOpen, setModalOpen] = useState(false)
    const [statusInfo, setStatusInfo] = useState([])
    // add match data from the API to state
    const handleReturnedMatchData = (data) => {
        setModalOpen(true)
        if (data.status === 400) setStatusInfo(statusInfo => [...statusInfo, 'error'])
        const message = `Added OK: ${data.player1.name} (${data.player1.name}) vs ${data.player2.name} (${data.player2.name})`
        setStatusInfo(statusInfo => [...statusInfo, message])
        setMatchesData(matchesData => [...matchesData, data])
    }

    const handleDialogClose = () => {
        setModalOpen(false)
        setStatusInfo([])
    }

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files || []) // convert from iterable object to array
        files.forEach((file, i) => {
            // check that this match hasn't been uploaded already
            const reader = new FileReader()
            reader.onload = function (event) {
                let content = new TextDecoder().decode(event.target.result)
                let urlregex = /https:\/\/hsreplay.net\/replay\/\w+/i
                let url = content.match(urlregex)[0]
                
                // match = { matchesData.find((match) => match.id === selectedMatchID) } />
            };
            reader.readAsArrayBuffer(file);
            
            const formData = new FormData()
            formData.append("file", file)
            fetch('http://127.0.0.1:5000/post', {
                method: 'POST',
                body: formData
            })
            .then((res) => res.json())
            .then((jsondata) => handleReturnedMatchData(jsondata))
            .catch((err) => console.log('PANIC! ' + err))
        })
        
    }
    
    
    return (
        <>
        <form>
            <input
                accept=".xml"
                style={{ display: 'none' }}
                id="fileuploadinput"
                name="files"
                multiple
                type="file"
                onChange={handleFileUpload}
            />
            <label htmlFor="fileuploadinput">
                    <Button color="secondary" variant="contained" component="span" sx={{ m: 2 }}>
                    Upload
                </Button>
            </label>

        </form>
            
            <Dialog
                open={modalOpen}
                onClose={handleDialogClose}
                scroll="paper"
                aria-labelledby="status-modal-title"
                aria-describedby="status-modal-description"
            >
                <Box style={{ whiteSpace: 'pre-line' }} sx={{ fontFamily: 'Monospace', m: 4 }}>
                    {statusInfo.map((s) => `${s}\n`)}
                </Box>
            </Dialog>
        </>
    )
}

export default FileUploader