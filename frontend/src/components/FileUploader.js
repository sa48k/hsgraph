import React from 'react'
import Button from '@mui/material/Button'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

function FileUploader({ filesToUpload, setMatchData }) {
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files || []) // convert from iterable object to array
        console.log(files) // debug
        // setFilesToUpload(files)
        const formData = new FormData()
        files.forEach((file, i) => {
            formData.append(`file-${i}`, file, file.name)
        })

        fetch('http://127.0.0.1:5000/post', {
            method: 'Post',
            body: formData
        })
            .then((res) => res.json())
            .then((data) => setMatchData(data))
            .catch((err) => console.log(err))
    }


    return (
        <>
            <input
                accept=".xml"
                style={{ display: 'none' }}
                id="fileuploadinput"
                multiple
                type="file"
                onChange={handleFileUpload}
            />
            <label htmlFor="fileuploadinput">
                <Button color="secondary" variant="contained" component="span">
                    Upload
                </Button>
            </label>

            {/* <List dense={true}>
                {uploadedFiles.map(file => (
                    <ListItem>
                        <ListItemText primary={file.name} />
                    </ListItem>
                ))}
                
            </List> */}
        </>
    )
}

export default FileUploader