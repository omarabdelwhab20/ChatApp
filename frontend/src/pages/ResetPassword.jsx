import React from 'react'
import {Alert , Button , Form , Row , Col , Stack} from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const ResetPassword = () => {
  return (
    <>
      <Form>
        <Row style={{
          height : "100vh",
          justifyContent : "center",
          paddingTop : "10%"
          }}>
          <Col xs={6}>
            <Stack  gap={3}>
              <h2>ResetPassword</h2>
              <Form.Control type="email" placeholder="Email" />
              <Button variant='primary' type='submit'>
                Reset Password
              </Button>
              
              <Alert variant='danger'><p>An error occured</p></Alert>
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  )
}
