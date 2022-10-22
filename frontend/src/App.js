import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Badge from '@mui/material/Badge';
// import { Drawer, ListItem, ListItemIcon, ListItemText, Button } from "@material-ui/core";
// import Sidebar from './components/Sidebar'
// import Header from './components/Header'
import Dashboard from './components/Dashboard'

export default function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h5">
            Title
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ border: 1, borderColor: 'primary.main', height: 'calc(100vh - 50px)' }}>

        <Grid container spacing={0} sx={{ height: '75%' }} >

          <Grid p={3} xs={6} sx={{ border: 1, height: '100%' }}>
            <Typography variant="h1">xs=6</Typography>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel porro aut esse iste blanditiis quia, eos illo, vitae cumque unde voluptates recusandae ipsam repellat corrupti voluptas nobis. Et, voluptate sit?</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel porro aut esse iste blanditiis quia, eos illo, vitae cumque unde voluptates recusandae ipsam repellat corrupti voluptas nobis. Et, voluptate sit?</p>
          </Grid>
          <Grid p={3} xs={6} sx={{ border: 1, height: '100%', borderColor: "red" }} >
            <h1>xs=6</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel porro aut esse iste blanditiis quia, eos illo, vitae cumque unde voluptates recusandae ipsam repellat corrupti voluptas nobis. Et, voluptate sit?</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel porro aut esse iste blanditiis quia, eos illo, vitae cumque unde voluptates recusandae ipsam repellat corrupti voluptas nobis. Et, voluptate sit?</p>
          </Grid>
        </Grid>

        <Box xs={12} sx={{ border: 1, height: "25%", borderColor: "green" }} >
          <Typography variant="h4">xs=12</Typography>
        </Box>
        {/* <input directory="" webkitdirectory="" type="file" />
      <Dashboard /> */}
      </Container>
    </>
  );
}