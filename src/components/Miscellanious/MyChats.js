import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box, Button, Stack, useToast,Text } from '@chakra-ui/react'
import axios from 'axios'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from './ChatLoading'
import { getSender } from '../../Config/ChatLogic'
import GroupChatModel from './GroupChatModel'

const MyChats = ({fetchAgain}) => {
  const [loggedUser,setLoggedUser]=useState()
  const {chats,setChats, user, setUser,selectedchat,setSelectedChat }=ChatState()
  const toast=useToast()

  const fetchChat = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
  
      // Corrected: added await before axios.get
      const { data } = await axios.get('/api/chat', config);
      setChats(data);
    } catch (error) {
      toast({
        title: `Error fetching the chats`,
        description: error.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };
  
 useEffect(()=>{
setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
fetchChat()
 },[fetchAgain])

  return (
   <Box
   display={{ base: selectedchat ? "none" : "flex", md: "flex" }}
   flexDir="column"
   alignItems="center"
   p={3}
   bg="white"
   w={{ base: "100%", md: "31%" }}
   borderRadius="lg"
   borderWidth="1px"
   >
    <Box
      pb={3}
      px={3}
      fontSize={{ base: "28px", md: "30px" }}
      fontFamily="Work sans"
      display="flex"
      w="100%"
      justifyContent="space-between"
      alignItems="center"
    >
       My Chats
       <GroupChatModel>
       <Button
       display='flex'
       fontSize={{ base: "17px", md: "10px", lg: "17px" }}
       rightIcon={<AddIcon />
      }
       >
        New Group Chat
       </Button>
       </GroupChatModel>
    </Box>

    <Box
    display='flex'
    flexDir='column'
    p={3}
    bg="#F8F8F8"
    w='100%'
    h='100%'
    borderRadius='lg'
    overflowY='hidden'
    >{
      chats ?(
        <Stack overflowY="scroll">
        {chats.map((chat) => (
          <Box
            onClick={() => setSelectedChat(chat)}
            cursor="pointer"
            bg={selectedchat === chat ? "#38B2AC" : "#E8E8E8"}
            color={selectedchat === chat ? "white" : "black"}
            px={3}
            py={2}
            borderRadius="lg"
            key={chat._id}
          >
            <Text>
              {!chat.isGroupChat
                ? getSender(loggedUser, chat.users)
                : chat.chatName}
            </Text>
            {chat.latestMessage && (
              <Text fontSize="xs">
                <b>{chat.latestMessage.sender.name} : </b>
                {chat.latestMessage.content.length > 50
                  ? chat.latestMessage.content.substring(0, 51) + "..."
                  : chat.latestMessage.content}
              </Text>
            )}
          </Box>
        ))}
      </Stack>
      ):(
        <ChatLoading/>
      )
    }

    </Box>
   </Box>
  )

}
export default MyChats
