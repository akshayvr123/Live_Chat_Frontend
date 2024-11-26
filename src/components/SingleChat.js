import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box,FormControl,IconButton,Input,Spinner,Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull, isSameSender } from '../Config/ChatLogic'
import ProfileModel from './Miscellanious/ProfileModel'
import UpdateGroupChatModal from './Miscellanious/UpdateGroupChatModal'
import axios from 'axios'
import "./styles.css"
import ScrollableChat from './ScrollableChat'
import io from "socket.io-client"
// import Lottie from 'react-lottie'
import animationData from "../Animations/typing.json";


const ENDPOINT=process.env.BACKEND_URL
var socket,selectedChatCompare

const SingleChat = ({fetchAgain,setFetchAgain}) => {
   const toast=useToast()
  const[messages,setMessage]=useState([])
  const[loading,setLoading]=useState(false)
  const[newMessage,setNewMessage]=useState()
  const[typing,setTyping]=useState(false)
  const[isTyping,setIsTyping]=useState(false)
  const[socketConnected,setSocketConnected]=useState(false)
   const {user,selectedchat,setSelectedChat,notification,setNotification} = ChatState()

   const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
    
   const fetchMessages=async()=>{
    if(!selectedchat) return;
    try {
      const config={
        headers:{
          "Content-type":"application/json",
          Authorization:`Bearer ${user.token}`
        }
        
      }
      const {data}=await axios.get(`${ENDPOINT}/api/messages/${selectedchat._id}`,config)
      
      setMessage(data)
      setLoading(false)
      socket.emit("join chat",selectedchat._id)
      
    } catch (error) {
      toast({
        title: `Error Occured`,
        description: error.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'bottom',
      });
      
    }
   }
   useEffect(()=>{
    socket=io(ENDPOINT)
    socket.emit('setup',user)
    socket.on("connected",()=>{
      setSocketConnected(true)
    })
    socket.on('typing',()=>setIsTyping(true))
    socket.on('stop typing',()=>setIsTyping(false))
   },[])

   useEffect(()=>{
    fetchMessages();
    selectedChatCompare=selectedchat
   },[selectedchat])
  

   useEffect(()=>{
    socket.on('message recieved',(newMessageRecieved)=>{
      if(!selectedChatCompare || selectedChatCompare._id!==newMessageRecieved.chat._id){
        if(!notification.includes(newMessageRecieved)){
          setNotification([newMessageRecieved,...notification])
         
          setFetchAgain(!fetchAgain)
        }
      }else{
        setMessage([...messages,newMessageRecieved])
      }
    })
   })


   
   const sendMessage=async(event)=>{
    if(event.key==='Enter' && newMessage){
      socket.emit("stop typing",selectedchat._id)
     try {
     
      const config={
        headers:{
          "Content-type":"application/json",
          Authorization:`Bearer ${user.token}`
        }
        
      }
      setNewMessage("")
      const {data}=await axios.post(`${ENDPOINT}/api/messages`,{
        content:newMessage,
        chatId:selectedchat._id,
       
      }, config)
      
      socket.emit('new message',data)

     
      setMessage([...messages, data]);
     } catch (error) {
      toast({
        title: `Error Occured`,
        description: error.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'bottom',
      });
      
     }
    }
   }
   const typingHandler=(e)=>{
     setNewMessage(e.target.value);
    //  typog indiactor
    if(!socketConnected) return;
    if(!typing){
      setTyping(true)
      socket.emit("typing",selectedchat._id)
    }
    let lastTypingTime=new Date().getTime()
    var timerLength=3000
    setTimeout(()=>{
      var timeNow=new Date().getTime()
      var timeDiff=timeNow-lastTypingTime

      if(timeDiff>=timerLength && typing){
        socket.emit('stop typing',selectedchat._id)
        setTyping(false)
      }
    },timerLength)
   }
   return (
    <>
      {selectedchat ?(
        <>
        <Text 
           fontSize={{ base: "28px", md: "30px" }}
           pb={3}
           px={2}
           w="100%"
           fontFamily="Work sans"
           display="flex"
           justifyContent={{ base: "space-between" }}
           alignItems="center"
        >
             <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
             {!selectedchat.isGroupChat ?(
               <>
              {getSender(user,selectedchat.users)}
              <ProfileModel user={getSenderFull(user,selectedchat.users)}/>
               </>
             ):(
               <>
               {selectedchat.chatName.toUpperCase()}
               {
                 <UpdateGroupChatModal
                 fetchMessages={fetchMessages}
                 fetchAgain={fetchAgain}
                 setFetchAgain={setFetchAgain}
               />
               }
               </>
             )}

        </Text>

        <Box
          display="flex"
          flexDir="column"
          justifyContent="flex-end"
          p={3}
          bg="#E8E8E8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
            {
              loading ?(
                <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf='center'
                margin='auto'
                />
              ):(
                <div className='messages'>
                 
                  <ScrollableChat  messages={messages}>
                
                  </ScrollableChat>
                </div>
              )
            }
            <FormControl isRequired mt={3} onKeyDown={sendMessage}>
               
               {isTyping ? <div>
                {/* <Lottie 
                options={defaultOptions}
                width={70}
                style={{marginBottom:15,marginLeft:0}}
                /> */}
               </div> :""}
               <Input
               variant='filled'
               bg='#E0E0E0'
               placeholder='Enter a message...'
               onChange={typingHandler}
               value={newMessage}
               />
            </FormControl>
        </Box>
        </>
      ):(
        <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        h='100%'
        >
        <Text fontSize='3xl' pb={3} fontFamily='work sans'>
            Click On a user to Start Chat
        </Text>

        </Box>
      )}
    </>
  )
}

export default SingleChat
