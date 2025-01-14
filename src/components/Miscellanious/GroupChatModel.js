import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'


const GroupChatModel = ({children}) => {
  const ENDPOINT=process.env.REACT_APP_BACKEND_URL
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName,setGroupChatName]=useState()
    const [selectedUsers,setSelectedUsers]=useState([])
    const [search,setSearch]=useState()
    const [searchResults,setSearchResults]=useState()
    const [loading,setLoading]=useState(false)
    const toast=useToast()

    const {user,chats,setChats}=ChatState()

    const handleSearch=async(query)=>{

        setSearch(query)
        if(!query){
            return
        }try {
            setLoading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }

            const {data}=await axios.get(`${ENDPOINT}/api/user?search=${search}`,config)
           console.log(data);
            setLoading(false)
            setSearchResults(data)
        } catch (error) {
            toast({
                title: 'Error Occured.',
                description: "Error",
                status: 'error',
                duration: 5000,
                isClosable: true,
              })
        }


    }
    const handleSubmit=async()=>{
      if(!groupChatName || !selectedUsers){
        toast({
          title: 'Please fill all the fields',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:'top'
        })
        return
      }

      try {
        const config={
          headers:{
              Authorization:`Bearer ${user.token}`
          }
      }
      const {data}= await axios.post(`${ENDPOINT}/api/chat/group`,{
        name:groupChatName,
        users:JSON.stringify(selectedUsers.map((u)=>u._id))
      },config)
        
      setChats([data,...chats])
      onClose()
      setSelectedUsers([])
      setSearchResults()
      toast({
        title: 'New group Chat created successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      })
      
      } catch (error) {
        
      }
    }

    const handleDelete=(deleted)=>{
      setSelectedUsers(selectedUsers.filter(sel=>sel._id !==deleted._id))
    }

    const handleGroup=(userToAdd)=>{
      if(selectedUsers.includes(userToAdd)){
        toast({
            title: 'User Alredy Added',
            description: "Error",
            status: 'warning',
            duration: 5000,
            isClosable: true,
          })
      }
      setSelectedUsers([...selectedUsers,userToAdd])
    }

    return (
        <>
          <span onClick={onOpen}>{children}</span>
    
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
              fontSize='35px'
              fontFamily='work sans'
              display='flex'
              justifyContent='center'
              >Create Group Chat</ModalHeader>
              <ModalCloseButton />
              <ModalBody
              display='flex'
              flexDir='column'
              alignItems='center'
              >
                <FormControl>
                    <Input 
                    placeholder='Chat Name'
                    mb={3}
                    onChange={(e)=>setGroupChatName(e.target.value)}
                    />
  
                </FormControl>
                <FormControl>
                    <Input 
                    placeholder='Add Users eg:akshay,anoop'
                    mb={1}
                    onChange={(e)=>handleSearch(e.target.value)}
                    />
  
                </FormControl>

                <Box w='100%' display='flex' flexWrap='wrap'>
                {selectedUsers.map(u=>(
                    <UserBadgeItem key={u._id} user={u} 
                    handleFunction={()=>handleDelete(u)}
                    />
                ))}
                </Box>
              
                {loading ?<div>loading</div>:(
                    searchResults?.slice(0,4).map(user=>(
                        <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>
                    )

                    )
                )}
                
              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='blue'  onClick={handleSubmit}>
                  Create GroupChat
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}

export default GroupChatModel
