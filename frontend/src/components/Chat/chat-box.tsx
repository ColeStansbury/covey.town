import React, {useEffect, useState} from "react";
import {
  Box,
  Button,
  Fab,
  Grid,
  InputLabel,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@material-ui/core";
import '../../App.css';
import {makeStyles, createStyles} from "@material-ui/styles";
import SendIcon from '@material-ui/icons/Send';


const useStyles = makeStyles({
  root: {},
  chatbox: {
    position: 'absolute',
    top: '2%',
    right: '2%',
    bottom: '50vh',
  }
});
//  dummy data- to be replaced later
const messageList = [{
  content: "TEST",
  _senderProfileId: 0,
  _recipient: "2DA11483",
  date: new Date()
},
  {
    content: "TEST",
    _senderProfileId: 0,
    _recipient: "2DA11483",
    date: new Date()
  }
]


//  look up jss
//  look up default breakpoint
//  can do inline hover styling
const ChatBox = (): JSX.Element => {
  const [messages, setMessages] = useState(messageList)
  const [newMessage, setNewMessage] = useState<string>('')
  const classes = useStyles();

  //  we would use an api call here to get messages, similar to town refresh
  //  api call- would change message state- may not need useEffect. useState and its rerender may be more effective
  useEffect(() => {
    const getMessages = () => setMessages(messageList)

    getMessages()
  })

  useEffect(() => {
    const getMessages = () => setMessages(messageList)

    const refreshTimer = setTimeout(() => {
      getMessages()
    }, 100)

    return () => clearTimeout(refreshTimer);

  }, [messages])


  const sendMessage = async (message: string) => {
    messageList.push({
      content: message,
      _senderProfileId: 0,
      _recipient: "EEE7FD95",
      date: new Date()
    })
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
          {messages.map((message, i) => <Grid key={message.date.toDateString()}>
              <ListItem>{message._senderProfileId}</ListItem>
              <ListItemText>{message.content}</ListItemText>
            </Grid>
          )}

        </Grid>
        <Grid>
          <TextField
            className="form-control"
            variant="outlined"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
          />
          <Fab onClick={() => sendMessage(newMessage)}><SendIcon color="secondary"/></Fab>
        </Grid>
      </Grid>
    </Box>
  )

}


export default ChatBox;
