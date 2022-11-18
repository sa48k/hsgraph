import React from 'react'
import Button from '@mui/material/Button'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

function FileUploader({ uploadedFiles, setUploadedFiles }) {
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files || [])
        console.log(files) // debug
        setUploadedFiles(files)
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

            <List dense={true}>
                {uploadedFiles.map(file => (
                    <ListItem>
                        <ListItemText primary={file.name} />
                    </ListItem>
                ))}
                
            </List>
        </>
    )
}

export default FileUploader