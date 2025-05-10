import React from 'react'
import {Alert , Button , Form , Row , Col , Stack} from 'react-bootstrap'

export const VerifyCode = () => {
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
              <h2>VerifyCode</h2>
              <Form.Control type="text" placeholder="Code" />
              <Button variant='primary' type='submit'>
                Verify
              </Button>
              
              <Alert variant='danger'><p>An error occured</p></Alert>
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  )
}
