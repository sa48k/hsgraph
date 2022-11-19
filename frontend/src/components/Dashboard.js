import React, { useState, useEffect } from 'react'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import MuiDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import MatchList from './MatchList'
import FileUploader from './FileUploader'
import GraphGridItems from './GraphGridItems'
import Dialog from '@mui/material/Dialog'
import Card from '@mui/material/Card'

const drawerWidth = 240

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
	({ theme, open }) => ({
		'& .MuiDrawer-paper': {
			position: 'relative',
			whiteSpace: 'nowrap',
			width: drawerWidth,
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
			boxSizing: 'border-box',
			...(!open && {
				overflowX: 'hidden',
				transition: theme.transitions.create('width', {
					easing: theme.transitions.easing.sharp,
					duration: theme.transitions.duration.leavingScreen,
				}),
				width: theme.spacing(7),
				[theme.breakpoints.up('sm')]: {
					width: theme.spacing(9),
				},
			}),
		},
	}),
)

const mdTheme = createTheme()

const DashboardContent = () => {
	const [drawerOpen, setDrawerOpen] = useState(false)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [data, setData] = useState([])
	const [selectedMatchID, setSelectedMatchID] = useState('')
	const [matchData, setMatchData] = useState([])

	const getMatchesData = () => {
		fetch('./data/matchdata.json', {
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		})
			.then(res => res.json())
			.then(myJson => setData(myJson))
	}

	useEffect(() => {
		getMatchesData()
	}, [])

	const toggleDrawer = () => {
		setDrawerOpen(!drawerOpen)
	}

	return (
		<ThemeProvider theme={mdTheme}>
			<Box sx={{ display: 'flex' }}>
				<CssBaseline />
				<AppBar position="absolute" open={drawerOpen}>
					<Toolbar
						sx={{
							pr: '24px', // keep right padding when drawer closed
						}}
					>
						<IconButton
							edge="start"
							color="inherit"
							aria-label="open drawer"
							onClick={toggleDrawer}
							sx={{
								marginRight: '36px',
								...(drawerOpen && { display: 'none' }),
							}}
						>
							<MenuIcon />
						</IconButton>
						<Typography
							component="h1"
							variant="h6"
							color="inherit"
							noWrap
							sx={{ flexGrow: 1 }}
						>
							hsgraph v0.9
						</Typography>
						<IconButton color="inherit">
							{/* <Badge badgeContent={4} color="secondary">

							</Badge> */}
						</IconButton>
					</Toolbar>
				</AppBar>
				<Drawer variant="permanent" open={drawerOpen}>
					<Toolbar
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-end',
							px: [1],
						}}
					>
						<IconButton onClick={toggleDrawer}>
							<ChevronLeftIcon />
						</IconButton>
					</Toolbar>

					<List component="nav">
						<FileUploader setMatchData={setMatchData} />
					</List>

				</Drawer>
				<Box
					component="main"
					sx={{
						backgroundColor: (theme) =>
							theme.palette.mode === 'light'
								? theme.palette.grey[100]
								: theme.palette.grey[900],
						flexGrow: 1,
						height: '100vh',
						overflow: 'auto',
					}}
				>
					<Toolbar />
					<Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
						<Grid container spacing={3}>
							<GraphGridItems
								matches={data}
								setDialogOpen={setDialogOpen}
								setSelectedMatchID={setSelectedMatchID}
							/>
						</Grid>

					</Container>
					<Dialog open={dialogOpen}>
						<Card sx={{ p: 4 }}>
							<Typography variant="h1" component="div">
								Todo: big graph card
							</Typography>
						</Card>
					</Dialog>
				</Box>
			</Box>
		</ThemeProvider>
	)
}

export default function Dashboard() {
	return <DashboardContent />
}
