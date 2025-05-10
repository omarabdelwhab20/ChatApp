import {Routes , Route , Navigate} from 'react-router-dom' 
import { Chat } from './pages/Chat'
import { Register } from './pages/Register'
import { Login } from './pages/Login'
import "bootstrap/dist/css/bootstrap.min.css"
import {Container} from 'react-bootstrap'
import { NavBar } from './components/NavBar'
import { ResetPassword } from './pages/ResetPassword'
import { ChangePassword } from './pages/ChangePassword'
import { VerifyCode } from './pages/VerifyCode'
function App() {


  return (
    <>
      <NavBar />
      <Container>
        <Routes>
          <Route path='/' element={<Chat />} />

          <Route path='/sign-up' element={<Register />} />

          <Route path='/sign-in' element={<Login />} />

          <Route path='/reset-password' element={<ResetPassword />} />

          <Route path='/change-password' element={<ChangePassword />} />

          <Route path='/verify-code' element={<VerifyCode />} />

          <Route path='*' element={<Navigate to={'/'} />} />
        </Routes>
      </Container>
    </>
  )
}

export default App
