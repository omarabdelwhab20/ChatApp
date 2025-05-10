import React from 'react'
import {Alert , Button , Form , Row , Col , Stack} from 'react-bootstrap'

export const ChangePassword = () => {
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
              <h2>ChangePassword</h2>
              <Form.Control type="password" placeholder="New Password" />
              <Form.Control type="password" placeholder="Confirm New Password" />
              <Button variant='primary' type='submit'>
                ChangePassword
              </Button>
              
              <Alert variant='danger'><p>An error occured</p></Alert>
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  )
}
