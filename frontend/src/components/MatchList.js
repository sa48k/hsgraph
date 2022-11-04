import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InsightsIcon from '@mui/icons-material/Insights';
import ListSubheader from '@mui/material/ListSubheader';

const MatchList = (props) => {

	const listItems = props.matches.map((match) =>
		<>
			<ListItemButton key={match.id}>
				<ListItemIcon>
					<InsightsIcon />
				</ListItemIcon>
				<ListItemText primary={match.player1.class + ' vs ' + match.player2.class} secondary={match.player1.name + ' vs ' + match.player2.name} />
			</ListItemButton>
			<Divider sx={{ my: 1 }} />
		</>
	)

	return listItems
}

export default MatchList
// export const secondaryListItems = (
// 	<React.Fragment>
// 		<ListSubheader component="div" inset>
// 			Saved reports
// 		</ListSubheader>
// 		<ListItemButton>
// 			<ListItemIcon>
// 				<AssignmentIcon />
// 			</ListItemIcon>
// 			<ListItemText primary="Current month" />
// 		</ListItemButton>
// 		<ListItemButton>
// 			<ListItemIcon>
// 				<AssignmentIcon />
// 			</ListItemIcon>
// 			<ListItemText primary="Last quarter" />
// 		</ListItemButton>
// 		<ListItemButton>
// 			<ListItemIcon>
// 				<AssignmentIcon />
// 			</ListItemIcon>
// 			<ListItemText primary="Year-end sale" />
// 		</ListItemButton>
// 	</React.Fragment>
// );
