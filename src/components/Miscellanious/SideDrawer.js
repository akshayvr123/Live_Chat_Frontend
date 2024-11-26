import { Box, Button, Tooltip,Text, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, useToast, Spinner} from '@chakra-ui/react'
import {BellIcon,ChevronDownIcon,} from '@chakra-ui/icons'
import { Avatar } from '@chakra-ui/avatar'
import React, { useEffect, useState } from 'react'
import { ChatState,setSelectedChat } from '../../Context/ChatProvider'
import ProfileModel from './ProfileModel'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ChatLoading from './ChatLoading'
import UserListItem from '../UserAvatar/UserListItem'
import {getSender} from '../../Config/ChatLogic'
// import { Effect } from 'react-notification-badge'
// import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge'

const SideDrawer = () => {
  const ENDPOINT=process.env.BACKEND_URL
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {user,setSelectedChat,chats,setChats,notification,setNotification}=ChatState()
  const [search,setSearch]=useState("")
  const [searchResult,setSearchResult]=useState([])
  const [loading,setLoading]=useState(false)
  const [loadingChat,setLoadingChat]=useState()
  const [displayNotif,setDisplayNotif]=useState()
  const navigate=useNavigate()
  const toast=useToast()
  const logoutHandler=()=>{
    localStorage.removeItem("userInfo")
    navigate("/")
  }

  useEffect(() => {
    const sendNotification = async () => {
      console.log(notification+"This is");
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            
                const { data } = await axios.post(`${ENDPOINT}/api/notification`, {
                    notification: notification,
                }, config);
                
            
        } catch (error) {
            // Handle errors if necessary
            console.error(error);
        }
    };

    sendNotification();
}, [notification, user.token]);

useEffect(()=>{
  const getNotification = async () => {
    try {
        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        };

        const {data}=await axios.get(`${ENDPOINT}/api/notification`,config)
        setDisplayNotif(data)
        console.log(data);
       
      }catch(err){
        console.log(err);
      }
    }
  getNotification()
  
},[ user.token,notification])

 const handleSearch=async()=>{
  if(!search){
    toast({
      title: `please enter something in search`,
      status: 'error',
      duration: 2000,
      isClosable: true,
      position:'top-left'
    })
    return
  }

  try {
    setLoading(true)
    const config={
      headers:{
        Authorization:`Bearer ${user.token}`
      }
    }

    const {data}= await axios.get(`${ENDPOINT}/api/user/?search=${search}`,config)
    setLoading(false)
    setSearchResult(data)
  } catch (error) {
    toast({
      title: `please enter something in search`,
      status: 'error',
      duration: 2000,
      isClosable: true,
      position:'top-left'
    })
  }
 }
 
const accessChat=async(userId)=>{

  try {
    setLoadingChat(true)
    const config={
      headers:{
        "Content-type":"application/json",
        Authorization:`Bearer ${user.token}`
      }
    }

    const {data}=await axios.post(`${ENDPOINT}/api/chat`,{userId},config)
    if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
    setSelectedChat(data)
    setLoadingChat(false)
    onClose();

  } catch (error) {
    
    toast({
      title: `Error fetching the chats`,
      description:error.message,
      status: 'error',
      duration: 2000,
      isClosable: true,
      position:'bottom-left'
    })
  }
}

  return (
    <>
    <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
    >
      <Tooltip label="Search users to chat" 
      hasArrow 
      placement='bottom-end'>

        <Button variant="ghost" onClick={onOpen}>
        <i className="fas fa-search"></i>
        <Text d={{base:"none",md:"flex"}} px="4">Search User</Text>
        </Button>

      </Tooltip>

      <Text fontSize="2xl" >Talk-A-TIVE</Text>
      <div>
        <Menu>
          <MenuButton p={1}>
            {/* <NotificationBadge
            count={notification.length}
            effect={Effect.SCALE}
            /> */}
            <BellIcon fontSize='2xl' m={1}></BellIcon>
          </MenuButton>
          <MenuList pl={2}>
           
            {!notification.length && "No new messages"}
           
            {notification.map(notif=>(
              <MenuItem key={notif._id} onClick={()=>{
                setSelectedChat(notif.chat)
                setNotification(notification.filter((n)=>n!==notif))
              }}>
              {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}`
              :`New Message from ${getSender(user,notif.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
           <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic}/>
         </MenuButton>
         <MenuList>
          <ProfileModel user={user}>
          {/* <MenuItem>My Profile</MenuItem> */}
          </ProfileModel>
          <MenuDivider/>
          <MenuItem onClick={logoutHandler}>Logout</MenuItem>
         </MenuList>
        </Menu>
      </div>
    </Box>

    <Drawer placement='left' isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay/>
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
        <DrawerBody>
        <Box display='flex' pb={2}>
           <Input
           placeholder='Search User by name or email'
           mr={2}
           value={search}
           onChange={(e)=>setSearch(e.target.value)}
           />
           <Button
            onClick={handleSearch}
            >Go</Button>
        </Box>
        {loading ? (
          <ChatLoading/>
        ):
        searchResult?.map((user)=>{
         return(
          <UserListItem
          //props
          key={user.id}
          user={user}
          handleFunction={()=>accessChat(user._id)}
          ></UserListItem>)
        })
        }
        {loadingChat && <Spinner ml='auto' display='flex'/>}
      </DrawerBody>
      </DrawerContent>
      
    </Drawer>
    </>
  )
}

export default SideDrawer
