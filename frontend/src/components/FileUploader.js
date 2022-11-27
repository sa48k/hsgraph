import React from 'react'
import Button from '@mui/material/Button'
import List from '@mui/material/List';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

function FileUploader({ filesToUpload, setMatchData }) {
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files || []) // convert from iterable object to array
        console.log(files) // debug
        // setFilesToUpload(files)
        const formData = new FormData()
        console.log('HEEEEE')
        files.forEach((file, i) => {
            console.log('HAWWWW')
            formData.append("file", file)
        })
        console.log(Object.fromEntries(formData))

        fetch('http://127.0.0.1:5000/post', {
            method: 'POST',
            body: formData
        })
            .then((res) => res.json())
            .then((data) => console.log(data))

        // .then((data) => setMatchData(data))
        // .catch((err) => console.log(err))
    }

    return (
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
                <Button color="secondary" variant="contained" component="span" sx={{ mx: 2 }}>
                    Upload
                </Button>
            </label>
        </form>
    )
}

export default FileUploader