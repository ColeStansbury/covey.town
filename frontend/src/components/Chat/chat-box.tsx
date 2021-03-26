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
  Typography,
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
    // bottom: '70vh',
    background: '#efe4b1',
    width: '20vw',
    height: '70vh',
    borderRadius: '45px',
    overflow: 'auto'

  },
  chatHeader: {
    textAlign: 'center',
    background: '#4f4f4f',
    color:  '#ffffff',
    borderTopLeftRadius: '45px',
    borderTopRightRadius: '45px'
  },
  messageCreation: {
    position: 'fixed',
    bottom: 'flex-end'
  },
  messageWindow: {
    // minHeight: '50vh',
    overflow: 'auto'
  },
  messageBorder: {
    marginLeft: '5px',
    marginRight: '5px'
  },
  otherPlayerMessage: {
    float: 'left',
    textAlign: 'left'

  },
  otherPlayerMessageName: {
    color: '#1d2bff'
  },
  playerMessage: {
    alignItems: 'right',
    textAlign: 'left'
  },
  playerMessageName: {
    color: '#ff0c13'
  },

});


//  look up jss
//  look up default breakpoint
//  can do inline hover styling
const ChatBox = (): JSX.Element => {
  const [newText, setNewText] = useState<string>('')
  const classes = useStyles();

  //  we would use an api call here to get messages, similar to town refresh
  //  api call- would change message state- may not need useEffect. useState and its rerender may be more effective
  const {messages, myPlayerID, userName, emitMessage, currentTownFriendlyName} = useCoveyAppState();

  // useEffect(() => {
  //
  // }, [messages, emitMessage])


  const sendMessage = async (text: string) => {
    //  fixes bug that crashes server
    if (text.length === 0) {
      return;
    }
    emitMessage(new PlayerMessage(
      '',
      myPlayerID,
      userName,
      text,
      'town',
      new Date(),
    ));
    setNewText('')
  }
  const checkSender = (profileId: string) => (profileId === myPlayerID ? classes.playerMessage : classes.otherPlayerMessage)
  const checkSenderName = (profileId: string) => (profileId === myPlayerID ? classes.playerMessageName : classes.otherPlayerMessageName)

  return (
    <Box border={1}>
      <Grid className={classes.chatbox}>
        <Typography variant='h4' className={classes.chatHeader}>{currentTownFriendlyName}&apos;s chat</Typography>
        <Grid direction="row">
          <InputLabel id="playerChatSelection">Select A Player</InputLabel>
          <Select labelId="playerChatSelection">
            {/* Will map players in room here */}
            <MenuItem>Dummy Player Data 1</MenuItem>
            <MenuItem>Dummy Player Data 2</MenuItem>
          </Select>
        </Grid>
        <Grid className={classes.messageWindow} direction="column" container >
          {/*  Actual messages would go here */}
          {/* map messages here- ternary? popular function- clsx- space delimiter */}
          {/* TODO: get name from sender profile */}
          {/* {console.log(messages)} */}
          {messages.map((message) =>
            // console.log(message);
            (<Grid key={message.messageId} className={checkSender(message.senderProfileId)}>
              <ListItem className={checkSenderName(message.senderProfileId)}>{message.senderName}</ListItem>
              <Typography className={classes.messageBorder}>{message.content}</Typography>
            </Grid>)
          )
          }


        </Grid>
        <Grid className={classes.messageCreation}>
          <TextField

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
