import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Drawer, ListItem, ListItemIcon, ListItemText, Button } from "@material-ui/core";
import Sidebar from './components/Sidebar'
import Header from './components/Header'

export default function App() {
  return (
    <Box>
      <Sidebar />
      <Container style={{ backgroundColor: "red" }}>
        <h3>Hello World !!</h3>
      </Container>
    </Box>
  );
}