import React, { useEffect } from 'react'
import {Tab,Tabs,TabPanels,TabPanel, Container, Box, Text ,TabList} from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import { useNavigate } from 'react-router-dom'
const HomePage = () => {

  const navigate=useNavigate()
  useEffect(()=>{
    const  user= JSON.parse(localStorage.getItem("userInfo")) 
   
 
    if(user){
      navigate("/chats")
    }
     },[navigate]) 
 

  return (
    <Container maxW='xl' centerContent>
      <Box
        d='flex'
        justifyContent='center'
        p={3}
        bg={'white'}
        w='100%'
        m='40px 0 15px 0'
        borderRadius='ig'
        borderWidth='1px'
      >
        <Text
          fontSize='4xl'
          fontFamily='work sans'
          color='black'
        >Talk-A-Tive</Text>
      </Box>
      <Box
        bg='white'
        w='100%'
        p={4}
        borderRadius='lg'
        borderWidth='1px'
        color='black'
      >
        <Tabs variant='soft-rounded' >
          <TabList mb='1em'>
            <Tab width='50%'>Login</Tab>
            <Tab width='50%'>Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage
