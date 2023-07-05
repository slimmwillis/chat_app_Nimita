
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import NavBar from './components/NavBar';
import { AuthContext, AuthContextProvider } from './context/AuthContext';
import { useContext } from 'react';
import { ChatContextProvider } from './context/ChatContext';
import Home from './pages/Home';  

function App() {

  const { user } = useContext(AuthContext);

  return (
    <ChatContextProvider User={user}>
      <Router>
        <NavBar /> 
        <Container>
          <Routes>
            <Route path='/' element={user ? <Chat /> : <Login />}></Route>
            <Route path='/chat' element={user ? <Chat /> : <Login />}></Route>
            <Route path='/login' element={user ? <Chat /> : <Login />}></Route>
            <Route path='/register' element={user ? <Chat /> : <Register />}></Route>
            <Route path='/home' element={user ? <Home /> : <Login />}></Route>
            <Route path='*' element={<Navigate to="/" />}></Route>
          </Routes>
        </Container>
      </Router>
    </ChatContextProvider>
  );
}

export default App;
