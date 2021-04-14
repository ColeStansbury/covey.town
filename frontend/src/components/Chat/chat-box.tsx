import React, { useEffect, useRef, useState } from "react";

import _escapeRegExp from 'lodash/escapeRegExp'
import _uniqBy from 'lodash/uniqBy'
import _clone from 'lodash/clone'

import {
  Box,
  Fab,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { Mention, MentionsInput } from 'react-mentions'
import { useToast } from '@chakra-ui/react';
import '../../App.css';
import { makeStyles } from "@material-ui/styles";
import SendIcon from '@material-ui/icons/Send';
import useCoveyAppState from "../../hooks/useCoveyAppState";
import PlayerMessage from "../../classes/PlayerMessage";
import PlayerMention, { ServerMentionMessage } from "../../classes/PlayerMention";
import MentionUser from "../../classes/MentionUser";
import useMaybeVideo from "../../hooks/useMaybeVideo";


const useStyles = makeStyles(() => ({
  root: {},
  chatBox: {
    position: 'fixed',
    top: '20px',
    right: '80px',
    background: '#0e0e29',
    width: '20vw',
    height: '70vh',
    border: '3px solid #efe4b1',
    borderRadius: '45px',
    scrollbarGutter: '10px',
    maxHeight: '748px',
    minHeight: '300px',
    minWidth: '200px',
  },
  chatHeader: {
    textAlign: 'center',
    background: '#4f4f4f',
    color: '#ffffff',
    padding: '10px',
    borderTopLeftRadius: '40px',
    borderTopRightRadius: '40px',
    height: '12%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordWrap: 'break-word',
    display: 'block',
    fontSize: '1.5rem',
  },
  formControl: {
    background: '#efead6',
    alignContent: 'center',
    height: '8%',
  },
  selectAPlayerLabel: {
    fontSize: '1rem',
    lineHeight: '1rem',
  },
  messageCreation: {
    float: 'right',
    flexWrap: 'unset',
    height: '10%',
  },
  mentionText: {
    color: '#1d2bff'
  },
  messageContainer: {
    height: '70%',
    overflow: 'auto',
    maxHeight: '55vh',
    padding: '5px',
    '& .MuiGrid-container': {
      flexWrap: 'nowrap',
    },
  },
  message: {
    marginTop: '3px',
  },
  messageBubble: {
    padding: '3px',
    fontSize: '1rem',
  },
  messageBorder: {
    marginLeft: '5px',
    marginRight: '5px',
    backgroundColor: '#ffffff',
    borderRadius: '45px'
  },
  otherPlayerMessage: {
    float: 'left',
    textAlign: 'left',
  },
  otherPlayerMessageName: {
    color: '#ffffff',
    borderRadius: '45px',
    margin: '2px'
  },
  playerMessage: {
    float: 'right',
    textAlign: 'right',
  },
  playerMessageName: {
    color: '#ffffff',
    borderRadius: '45px',
    margin: '2px'
  },

  textField: {
    width: '100%',
    background: '#efead6',
    alignItems: 'end',
    bottom: 0,
    borderBottomLeftRadius: '40px',
    borderBottomRightRadius: '40px',
    minHeight: '56px',
    '& textarea#mentionsInput': {
      caretColor: '#0e0e29',
      padding: '5px 50px 5px 5px',
      '&:focus': {
        outline: 'none',
      },
    },
  },
  fabContainer: {
    alignItems: 'center',
  },
  fabIcon: {
    zIndex: 10,
    width: '45px',
    height: '45px',
    position: 'absolute',
    marginLeft: 'calc(100% - 50px)',
  },
  '@media (max-width: 1280px)': {
    chatBox: {
      top: '200px',
      maxHeight: '568px',
    },
    fabIcon: {
      width: '25px',
      height: '25px',
      top: 'calc(768 - 25)',
    },
  }
}));


//  look up jss
//  look up default breakpoint
//  can do inline hover styling
const ChatBox = (): JSX.Element => {
  //  we would use an api call here to get messages, similar to town refresh
  //  api call- would change message state- may not need useEffect. useState and its rerender may be more effective
  const {
    messages,
    myPlayerID,
    userName,
    emitMessage,
    currentTownFriendlyName,
    players,
    socket,
    playerColorMap
  } = useCoveyAppState();
  const [newText, setNewText] = useState<string>('')
  const [newRecipient, setNewRecipient] = useState<'town' | { recipientId: string }>('town');
  const classes = useStyles();
  const [users, setUsers] = useState<MentionUser []>([]);
  const video = useMaybeVideo();
  const onFocus = () => video?.pauseGame();
  const onBlur = () => video?.unPauseGame();
  const toast = useToast();
  const messagesEndRef = useRef<null | HTMLDivElement>(null)


  const scrollToBottom = () => {
    const messageWindow = document.getElementById("messageWindow")
    if (messageWindow) {
      const bottom = messageWindow?.scrollHeight - messageWindow?.clientHeight
      messageWindow.scrollTo(0, bottom)
    }
  }

  const checkSender = (profileId: string) => (profileId === myPlayerID ? classes.playerMessage : classes.otherPlayerMessage)
  const checkSenderName = (profileId: string) => (profileId === myPlayerID ?
    classes.playerMessageName : classes.otherPlayerMessageName)


  useEffect(() => {
    setUsers(players.filter(p => p.id !== myPlayerID)
      .map(player => new MentionUser(player.id, player.userName)));
  }, [myPlayerID, players])

  useEffect(() => {
    socket?.on('receivePlayerMention', (serverMessage: ServerMentionMessage) => {
      toast({
        title: `${serverMessage._senderName} mentioned you !`,
        status: 'success',
      });
    });
  }, [socket, toast])

  useEffect(() => {
    scrollToBottom()
  }, [messages]);


  const getDisplayTextFromMention = (text: string) => {
    let displayText: string = _clone(text)

    const tags: string[] = text.match(/@\{\{[^\\}]+\}\}/gi) || []

    tags.forEach(myTag => {
      const tagData = myTag.slice(3, -2)
      const tagDataArray = tagData.split('||')
      const tagDisplayValue = tagDataArray[1]
      displayText = displayText.replace(new RegExp(_escapeRegExp(myTag), 'gi'), `${tagDisplayValue} `)
    })
    return displayText;
  }

  const getIdsFromMention = (text: string) => {

    const tags: string[] = text.match(/@\{\{[^\\}]+\}\}/gi) || []
    const allUserIds = tags.map(myTag => {
      const tagData = myTag.slice(3, -2)
      const tagDataArray = tagData.split('||')
      return {id: tagDataArray[0], display: tagDataArray[1]}
    })
    return _uniqBy(allUserIds, myUser => myUser.id)
  }


  const sendMessage = async (text: string) => {
    //  fixes bug that crashes server
    if (text.length === 0) {
      return;
    }
    const mentions: MentionUser[] = getIdsFromMention(text);
    mentions.forEach(mention => {
      socket?.emit('sendPlayerMention', new PlayerMention(
        myPlayerID,
        userName,
        mention.id,
        new Date(),
      ));
    });

    const displayText = getDisplayTextFromMention(text);


    emitMessage(new PlayerMessage(
      '',
      myPlayerID,
      userName,
      displayText,
      newRecipient,
      new Date(),
    ));
    setNewText('');
    document.getElementById('mentionsInput')?.focus();
    onFocus();
  }


  const handleRecipientSelect = (e: React.ChangeEvent<{ value: unknown }>) => {
    const {value} = e.target;
    if (value === 'town') {
      setNewRecipient('town');
      setUsers(players.filter(p => p.id !== myPlayerID)
        .map(player => new MentionUser(player.id, player.userName)));
    } else {
      setNewRecipient({recipientId: value as string});
      setUsers(players.filter(p => p.id === value as string)
        .map(player => new MentionUser(player.id, player.userName)));

    }
  }

  return (
    <Box border={1} overflow="auto">
      <Grid className={classes.chatBox}>
        <Typography
          variant='h4'
          className={classes.chatHeader}>{currentTownFriendlyName}&apos;s chat</Typography>
        <FormGroup
          row
          className={classes.formControl}
        >
          <InputLabel
            className={classes.selectAPlayerLabel}
            id="playerChatSelection"

          >Select A Player
            <Select
              labelId="playerChatSelection"
              defaultValue='town'
              onChange={e => handleRecipientSelect(e)}
            >
              {players.filter(p => p.id !== myPlayerID).map((player) =>
                <MenuItem key={player.id} value={player.id}>{player.userName}</MenuItem>
              )}
              <MenuItem key='town' value='town' style={{backgroundColor: 'gray'}}>Town</MenuItem>
            </Select>
          </InputLabel>
        </FormGroup>

        <Box
          id="messageWindow"
          className={classes.messageContainer}>
          <Grid
            direction="column"
            container
          >
            <Box display="flex"
                 flexDirection="column"
                 justifyContent="flex-end"
                 overflow-y="scroll"
                 id="messageDiv"
            >

              {messages.map((message) =>

                (<Grid

                  key={message.messageId}
                  className={`${checkSender(message.senderProfileId)} ${classes.message}`}
                >
                  <Typography
                    className={`${checkSenderName(message.senderProfileId)} ${classes.messageBubble}`}
                    display="inline"
                    style={{

                      backgroundColor: `${playerColorMap.get(message.senderProfileId) || '#efead6'}`,
                      color: `${playerColorMap.get(message.senderProfileId) ? 'white' : 'black'}`
                    }}
                  >

                    &nbsp;
                    {message.recipient !== 'town' ? '(private) ' : ''}{message.senderName}
                    &nbsp;
                    {playerColorMap.get(message.senderProfileId) ? '' : '(left)'}
                  </Typography>
                  <Typography className={`${classes.messageBorder} ${classes.messageBubble}`}
                              display="inline"
                  >
                    &nbsp;{message.content}&nbsp;
                  </Typography>
                </Grid>)
              )
              }</Box>

            <div ref={messagesEndRef}

            />
          </Grid>
        </Box>
        <Grid container className={classes.messageCreation}>

          <MentionsInput
            id='mentionsInput'
            className={classes.textField}
            value={newText}
            onKeyUp={e => !e.shiftKey && e.key === 'Enter' ? sendMessage(newText) : undefined}
            onChange={(e) => setNewText(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            <Mention
              trigger="@"
              data={users}
              markup="@{{__id__||__display__}}"
            />
          </MentionsInput>
          <Fab
            className={classes.fabIcon}
            onClick={() => sendMessage(newText)}><SendIcon color="secondary"/></Fab>
        </Grid>
      </Grid>
    </Box>
  )

}

export default ChatBox;
