import React from 'react'
import Button from '@mui/material/Button'
import List from '@mui/material/List';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

function FileUploader({ matchesData, setMatchesData }) {

    // add match data from the API to state
    const handleReturnedMatchData = (data) => {
        console.log(data)
        if (data.status === 400) return null
        setMatchesData(matchesData => [...matchesData, data])
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
                    <Button color="secondary" variant="contained" component="span" sx={{ m: 2 }}>
                    Upload
                </Button>
            </label>

        </form>
            
        </>
    )
}

export default FileUploader