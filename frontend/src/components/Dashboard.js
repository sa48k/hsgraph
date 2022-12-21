import React, { useState, useEffect, useContext, createContext } from 'react'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import MuiDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import MenuIcon from '@mui/icons-material/Menu'
import BigChartDialog from './BigChartDialog'
import DrawerContent from './DrawerContent'
import GraphGridItems from './GraphGridItems'
import Dialog from '@mui/material/Dialog'
import { MyContext } from '../App'

const drawerWidth = 200
var displayedCardsCount = 0

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
	const [drawerOpen, setDrawerOpen] = useState(true)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [selectedMatchID, setSelectedMatchID] = useState('')
	const [matchesData, setMatchesData] = useState(() => {
		return JSON.parse(localStorage.getItem('data')) || []
	})

	const [filterOptions, setFilterOptions] = useState({
		player: 'All',
		opponent: 'All',
		sortFilter: 'Newest first',
		outcomeFilter: 'All matches'
	})
	const classColours = useContext(MyContext)

	const toggleDrawer = () => {
		setDrawerOpen(!drawerOpen)
	}

	const handleDialogClose = () => {
		setDialogOpen(false)
	}

	const removeMatch = (id) => {
		const idx = matchesData.findIndex(match => match.id === id)
		const matches = matchesData
		setMatchesData((matches) => matches.splice(idx, 1))
		setDialogOpen(false)
	}

	useEffect(() => {
		localStorage.setItem('data', JSON.stringify(matchesData));
	}, [matchesData]);

	return (
		<ThemeProvider theme={mdTheme}>
			<Box sx={{ display: 'flex' }}>
				<CssBaseline />
				<AppBar position="absolute" open={true}>
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
				<Drawer variant="permanent" open={true}>
					<DrawerContent matchesData={matchesData} setMatchesData={setMatchesData} filterOptions={filterOptions} setFilterOptions={setFilterOptions} />
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
								matchesData={matchesData}
								setDialogOpen={setDialogOpen}
								setSelectedMatchID={setSelectedMatchID}
								filterOptions={filterOptions}
							/>
						</Grid>

					</Container>
					<Dialog open={dialogOpen} onClose={() => handleDialogClose()} fullWidth={true} maxWidth="lg">
						<BigChartDialog match={matchesData.find((match) => match.id === selectedMatchID)} setDialogOpen={setDialogOpen} removeMatch={removeMatch} />
					</Dialog>

				</Box>
			</Box>
		</ThemeProvider>
	)
}

export default function Dashboard() {
	return <DashboardContent />
}