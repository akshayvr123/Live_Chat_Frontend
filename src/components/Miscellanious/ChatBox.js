import React from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SingleChat from '../SingleChat'

const ChatBox = ({fetchAgain,setFetchAgain}) => {

  const {selectedchat}=ChatState()
  return (
    <Box
    display={{ base: selectedchat ? "flex" : "none", md: "flex" }}
    alignItems="center"
    flexDir="column"
    p={3}
    bg="white"
    w={{ base: "100%", md: "68%" }}
    borderRadius="lg"
    borderWidth="1px">
      single Chat
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox
