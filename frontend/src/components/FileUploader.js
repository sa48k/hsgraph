import React, { useState, useRef, useEffect } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'

import Typography from '@mui/material/Typography'
import TextareaAutosize from '@mui/base/TextareaAutosize'

function FileUploader({ matchesData, setMatchesData }) {
    const [modalOpen, setModalOpen] = useState(false)
    const [statusInfo, setStatusInfo] = useState([])

    useEffect(() => {
        bottomRef.current?.scrollIntoView()
    }, [statusInfo]);

    // add match data from the API to state
    const handleReturnedMatchData = (data) => {
        setModalOpen(true)
        if (data.status === 400) {
            setStatusInfo(statusInfo => [...statusInfo, data.message])
        }
        const message = `Added ${data.gametype} match OK: ${data.player1.class} (${data.player1.name}) vs ${data.player2.class} (${data.player2.name})`
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
                var data = {}
                let content = new TextDecoder().decode(event.target.result)
                let urlregex = /https:\/\/hsreplay.net\/replay\/\w+/i
                let url = content.match(urlregex)[0]
                let checkAlreadyUploaded = matchesData.findIndex((match) => match.url === url)

                // if it has, toss it
                if (checkAlreadyUploaded !== -1) {
                    data['status'] = 400
                    data['message'] = `${file.name} has already been parsed and added`
                    handleReturnedMatchData(data)

                    // otherwise, send it to the API to be parsed
                } else {
                    const formData = new FormData()
                    formData.append("file", file)
                    fetch('http://127.0.0.1:5000/post', {
                        method: 'POST',
                        body: formData
                    })
                        .then((res) => res.json())
                        .then((jsondata) => handleReturnedMatchData(jsondata))
                        .catch((err) => console.log('PANIC! ' + err))
                }
            };
            reader.readAsArrayBuffer(file)
        })
    }

    const bottomRef = useRef(null);

    return (
        <>
            <form>
                <Button sx={{ mx: 2 }} color="secondary" variant="contained" component="label">
                    Upload XML
                    <input
                        accept=".xml"
                        style={{ display: 'none' }}
                        id="fileuploadinput"
                        name="files"
                        multiple
                        type="file"
                        onChange={handleFileUpload}
                        hidden
                    />
                </Button>


            </form>


            <Dialog
                open={modalOpen}
                onClose={handleDialogClose}
                maxWidth="lg"
                scroll="paper"
                fullWidth={true}
                PaperProps={{ sx: { position: "fixed", bottom: 0, m: 10, maxHeight: 300 } }}
                aria-labelledby="status-modal-title"
                aria-describedby="status-modal-description"
            >
                <Box style={{ position: "relative" }}>
                    <IconButton onClick={handleDialogClose} sx={{ position: "absolute", top: 30, right: 30 }} >
                        <CloseIcon />
                    </IconButton>
                    <Box style={{ whiteSpace: 'pre-line' }} sx={{ fontFamily: 'Monospace', m: 4 }}>
                        {statusInfo.map((s) => `${s}\n`)}
                    </Box>
                </Box>
            </Dialog>

        </>
    )
}

export default FileUploader