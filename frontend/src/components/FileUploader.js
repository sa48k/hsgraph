import React from 'react'
import Button from '@mui/material/Button'
import List from '@mui/material/List';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

function FileUploader({ matchesData, setMatchesData }) {
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files || []) // convert from iterable object to array
        files.forEach((file, i) => {
            const formData = new FormData()
            formData.append("file", file)
            fetch('http://127.0.0.1:5000/post', {
                method: 'POST',
                body: formData
            })
                .then((res) => res.json())
                .then((data) => setMatchesData(matchesData => [...matchesData, data]))
                .catch((err) => console.log(err))
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
                <Button color="secondary" variant="contained" component="span" sx={{ mx: 1 }}>
                    Upload
                </Button>
            </label>

        </form><br />
            <Button color="secondary" variant="contained" component="span" sx={{ mx: 1 }} onClick={() => setMatchesData([])}>
                Clear
            </Button>
        </>
    )
}

export default FileUploader