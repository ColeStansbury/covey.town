import React from "react";
import {Button, Grid, InputLabel, ListItem, ListItemText, MenuItem, Select, TextField, Typography} from "@material-ui/core";
import '../../App.css';
import {makeStyles, createStyles} from "@material-ui/styles";


const useStyles = makeStyles({
  root: {

  },
  chatbox: {
    position: 'absolute',
    top: '2%',
    right: '2%',
    bottom: '50vh',
  }
});
//  dummy data- to be replaced later
const messages =  [{
  content: "TEST",
  _senderProfileId: 0,
  _recipient: "EEE7FD95",
  date: new Date()
    },
  {
    content: "TEST",
    _senderProfileId: 0,
    _recipient: "EEE7FD95",
    date: new Date()
  }
]


//  look up jss
//  look up default breakpoint
//  can do inline hover styling
const ChatBox = (): JSX.Element => {


  const classes = useStyles();

  return (
    <Grid className={classes.chatbox}>
    <Grid direction="row">
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
        {/* TODO: get name from sender profile */}
        {messages.map((message, i) => <Grid key={message.date.toDateString()}>
          <ListItem>{message._senderProfileId}</ListItem>
          <ListItemText>{message.content}</ListItemText>
          </Grid>)}

      </Grid>
      <Grid>
        <TextField className="form-control" variant="outlined"/>
        <Button variant="contained">Send Chat</Button>
      </Grid>
    </Grid>
  )

}


export default ChatBox;
