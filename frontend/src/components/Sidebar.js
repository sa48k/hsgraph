import React from 'react'
import { useState } from "react";
import {
    CheckBoxOutlineBlankOutlined,
    DraftsOutlined,
    HomeOutlined,
    InboxOutlined,
    MailOutline,
    ReceiptOutlined,
} from "@material-ui/icons";
import { Drawer, ListItem, ListItemIcon, ListItemText, Button } from "@material-ui/core";

function Sidebar() {
    const data = [
        {
            name: "Home",
            icon: <HomeOutlined />,
        },
    ];

        const [open, setOpen] = useState(false);

        const getList = () => (
            <div style={{ width: 250 }} onClick={() => setOpen(false)}>
                {data.map((item, index) => (
                    <ListItem button key={index}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.name} />
                    </ListItem>
                ))}
        </div>
        )  
  return (
      <div>
          <Drawer open={true} anchor={"left"} variant="persistent" onClose={() => setOpen(false)} >
              {getList()}
              <Button variant="contained" onClick={() => { alert('Clicked !!') }}>Choose folder</Button>
          </Drawer>
    </div>
  )
}

export default Sidebar