import React from 'react'
import Button from '@mui/material/Button'
import List from '@mui/material/List';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

function FileUploader({ setMatchData }) {
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files || []) // convert from iterable object to array
        const formData = new FormData()
        files.forEach((file, i) => {
            formData.append("file", file)
        })
        fetch('http://127.0.0.1:5000/post', {
            method: 'POST',
            body: formData
        })
            .then((res) => res.json())
            .then((data) => setMatchData(data.data))
            .catch((err) => console.log(err))
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