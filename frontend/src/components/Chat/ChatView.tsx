import React, { useState } from "react";
import { Fab, Hidden } from "@material-ui/core";
import ForumIcon from '@material-ui/icons/Forum';
import { makeStyles } from "@material-ui/styles";
import ChatBox from "./chat-box";


const useStyles = makeStyles({
  root: {},
  chatToggle: {
    position: 'fixed',
    top: 'calc(768px - 56px)',
    right: '2%',
    zIndex: 1,
  }
});

const ChatView = (): JSX.Element => {

  const classes = useStyles();
  const [view, setView] = useState<boolean>(false)

  return (
    <>
      <Hidden only={['xs', 'sm', 'md', 'lg']}>
        <ChatBox/>
      </Hidden>
      <Hidden only={['xl']}>
        {
          view ? <ChatBox/> : null
        }
        <Fab className={classes.chatToggle}>
          <ForumIcon
            onClick={() => setView(!view)}/>
        </Fab>
      </Hidden>

    </>
  )

}

export default ChatView;
