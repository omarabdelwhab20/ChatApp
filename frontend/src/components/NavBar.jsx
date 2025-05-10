import React from 'react'
import { Container  , Nav , Navbar ,Stack } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const NavBar = () => {
  return (
    <Navbar bg="dark" className='mb-4' style={{height :"3.74rem"}}>
        <Container>
            <h2>
                <Link to={'/'} className='link-light text-decoration-none'>ChatApp</Link>
            </h2>
            <span className='text-warning'>Logges in as Charles</span>
            <Nav>
                <Stack direction="horizontal" gap={3}>
                    <Link to={'/sign-in'} className='link-light text-decoration-none'>Login</Link>
                    <Link to={'/sign-up'} className='link-light text-decoration-none'>Register</Link>

                </Stack>
                
            </Nav>
        </Container>
    </Navbar>
  )
}
