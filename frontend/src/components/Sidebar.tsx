import React from 'react'
import { useFilePicker } from 'use-file-picker';
import { nanoid } from 'nanoid'

function Sidebar() {
    const [openFileSelector, { filesContent, loading }] = useFilePicker({
        multiple: false,
        readAs: 'Text',
        accept: '.csv',
    })

    if (loading) {
        return <div>Loading...</div>
    }

    let csvdata: string = filesContent[0]?.content

    return (
        <div>
            <button onClick={() => openFileSelector()}>Select CSV file</button>
            <br />
                <div key={nanoid()}>{csvdata}</div>
                <br />
        </div>
    )
}
    
export default Sidebar