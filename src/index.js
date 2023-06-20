import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ChakraProvider, theme } from '@chakra-ui/react'
import AuthContextProvider from './context/AuthContext'

ReactDOM.render(
  <AuthContextProvider>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </AuthContextProvider>,
  document.getElementById('root')
)
