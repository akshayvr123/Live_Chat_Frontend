import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const[show,setShow]=useState(false)
  const[email,setEmail]=useState()
  const[password,setPasword]=useState()
  const[loading,setLoading]=useState(false)
  const ENDPOINT=process.env.REACT_APP_BACKEND_URL
  
  
  
  const navigate = useNavigate();
  const toast=useToast()
  const handleClick=()=>setShow(!show)


  const submitHandler=async()=>{
    setLoading(true)
    if(!email || !password){
      toast({
        title: 'Please Fill all the Fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      })
      setLoading(false)
      return;
    }
    try {
      const config={
        header:{
          "Content-type":"application/json"
        }
      }
      const {data}=await axios.post(
        `${ENDPOINT}/api/user/login`,
        {email,password},
        config
      )
      console.log(data);
      toast({
        title: 'Login Successfull',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      })
      localStorage.setItem('userInfo',JSON.stringify(data))
      setLoading(false)
      navigate('/chats')
    } catch (error) {
      toast({
        title: `error occured ${error}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      })
      setLoading(false)
    }
  }
  return (
    <VStack spacing='5px' color='black'>

      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder='Enter YourEmail'
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        ></Input>
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
        <Input
          type={show ?"text": 'password'}
          placeholder='Enter Your password'
          value={password}
          onChange={(e)=>setPasword(e.target.value)}
        ></Input>
        <InputRightElement width='4.5rem'>
          <Button h='1.75rem' size='sm' onClick={handleClick}>
            {show ? "hide":"Show"}
          </Button>
        </InputRightElement>
        </InputGroup>  
      </FormControl>

      
      <Button
      colorScheme='blue'
      width='100% '
      style={{marginTop:15}}
      onClick={submitHandler}
      isLoading={loading}
      >
        Login
      </Button>

      <Button
      variant='solid'
      colorScheme='red'
      width='100% '
     
      onClick={()=>{
        setEmail("guest@example.com")
        setPasword('123456')
      }}
      >
        Get Guest user Credential
      </Button>

      
    </VStack>
  )
}

export default Login
