import React, {useState} from "react";
import {
  Box,
  Fab,
  Grid,
  InputLabel,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import {nanoid} from 'nanoid';
import '../../App.css';
import {makeStyles} from "@material-ui/styles";
import SendIcon from '@material-ui/icons/Send';
import useCoveyAppState from "../../hooks/useCoveyAppState";
import PlayerMessage from "../../classes/PlayerMessage";


const useStyles = makeStyles({
  root: {},
  chatbox: {
    position: 'absolute',
    top: '2%',
    right: '2%',
    bottom: '50vh',
  }
});


//  look up jss
//  look up default breakpoint
//  can do inline hover styling
const ChatBox = (): JSX.Element => {
  const [newText, setNewText] = useState<string>('')
  const classes = useStyles();

  //  we would use an api call here to get messages, similar to town refresh
  //  api call- would change message state- may not need useEffect. useState and its rerender may be more effective
  const {messages, myPlayerID, userName, emitMessage} = useCoveyAppState();

  // useEffect(() => {
  //
  // }, [messages, emitMessage])


  const sendMessage = async (text: string) => {
    emitMessage(new PlayerMessage(
      '',
      myPlayerID,
      userName,
      text,
      'town',
      new Date(),
    ));
  }


  return (
    <Box color="blue" border={1}>
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
          {/* {console.log(messages)} */}
          {messages.map((message) =>
            // console.log(message);
             (<Grid key={message.messageId}>
              <ListItem>{message.senderName}</ListItem>
              <ListItemText>{message.content}</ListItemText>
            </Grid>)
          )
          }


        </Grid>
        <Grid>
          <TextField
            className="form-control"
            variant="outlined"
            value={newText}
            onChange={e => setNewText(e.target.value)}
          />
          <Fab onClick={() => sendMessage(newText)}><SendIcon color="secondary"/></Fab>
        </Grid>
      </Grid>
    </Box>
  )

}

export default ChatBox;
