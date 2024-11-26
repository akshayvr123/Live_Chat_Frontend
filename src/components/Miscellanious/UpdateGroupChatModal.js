import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'

const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchMessages}) => {
  const ENDPOINT=process.env.BACKEND_URL
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [search,setSearch]=useState()
    const [searchResults,setSearchResults]=useState()
    const [loading,setLoading]=useState(false)
    const [renameloading,setRenameloading]=useState(false)
    const toast=useToast()

    const {selectedchat,setSelectedChat,user }=ChatState()

    const handleRemove=async(user1)=>{
        if (selectedchat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
              title: "Only admins can remove someone!",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            return;
          }
          try {
            setLoading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}=await axios.put(
                `${ENDPOINT}/api/chat/groupremove`,
                {
                    chatId:selectedchat._id,
                    userId:user1._id
                },
                config
            );

            user1._id===user._id?setSelectedChat():setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            fetchMessages()
            setLoading(false)

          } catch (error) {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
            
          }

    }
    const handleAddUser=async(user1)=>{
        if (selectedchat.users.find((u) => u._id === user1._id)) {
            toast({
              title: "User Already in group!",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            return;
          }
          
    if (selectedchat.groupAdmin._id !== user._id) {
        toast({
          title: "Only admins can add someone!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }

      try {
        setLoading(true)
        const config={
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        }
        const {data}=await axios.put(`${ENDPOINT}/api/chat/groupadd`,{
            chatId:selectedchat._id,
            userId:user1._id
        },config)

        setSelectedChat(data)
        setFetchAgain(!fetchAgain)
        setLoading(false)

      } catch (error) {
        toast({
            title: "Error Occured",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        
      }

        
    }
    const handleRename=async()=>{
        if(!groupChatName) return
        try {
            setRenameloading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}=await axios.put(`${ENDPOINT}/api/chat/rename`,{
                chatId:selectedchat._id,
                chatName:groupChatName

            },config)

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameloading(false)
        } catch (error) {
            toast({
                title: 'Change name failed',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:'bottom'
              })
              setRenameloading(false)
        }
        setGroupChatName("")

    }
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

  
  return (
    <>
    <IconButton display={{base:'flex'}} icon={<ViewIcon/>} onClick={onOpen}/>

    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          fontSize="35px"
          fontFamily="Work sans"
          display="flex"
          justifyContent="center"
        >{selectedchat.chatName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box w='100%' display='flex' flexWrap='wrap' pb={3}>
            {selectedchat.users.map(u=>(
                 <UserBadgeItem key={u._id} user={u} 
                 handleFunction={()=>handleRemove(u)}
                 />
            ))}
          </Box>
          <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

          {loading ?(
            <Spinner size='lg'/>
          ):(
            searchResults?.map((user)=>{
                return(
                <UserListItem
                key={user._id}
                user={user}
                handleFunction={()=>handleAddUser(user)}
                />)
            })
          )}

        </ModalBody>

        <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  )
}

export default UpdateGroupChatModal
