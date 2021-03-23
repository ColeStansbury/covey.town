import React from "react";
import {Button, Grid, InputLabel, MenuItem, Select, TextField} from "@material-ui/core";
import '../../App.css';
import {makeStyles, createStyles} from "@material-ui/styles";


// const styles = () => createStyles({
//   root: {
//
//   },
//   chatbox: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     bottom: '50vh',
//   }
// });
//
// interface Props extends WithStyles<typeof styles> {
//   classes: {
//     root: string;
//     chatbox: string;
//   }
// }



//  look up jss
//  look up default breakpoint
//  can do inline hover styling
const ChatBox = (): JSX.Element => {


  // const classes = useStyles

  return (
    // <Grid className={classes.chatbox}>
    <Grid className="chatbox">
    <Grid className="form-group row">
        <InputLabel id="playerChatSelection">Select A Player</InputLabel>
        <Select labelId="playerChatSelection">
          {/* Will map players in room here */}
          <MenuItem>Dummy Player Data 1</MenuItem>
          <MenuItem>Dummy Player Data 2</MenuItem>
        </Select>
      </Grid>
      <Grid className="messageWindow">
        {/*  Actual messages would go here */}
        {/* map messages here- ternary? popular function- clsx- space delimiter */}

      </Grid>
      <Grid>
        <TextField className="form-control" variant="outlined"/>
        <Button variant="contained">Send Chat</Button>
      </Grid>
    </Grid>
  )

}


export default ChatBox;
