import { useContext } from "react"
import { Alert, Button, Col, Form, Row, Stack } from "react-bootstrap"
import { AuthContext } from "../context/AuthContext"

const Register = () => {

    const { registerInfo, updateRegisterInfo, registerError, registerUser, isLoading } = useContext(AuthContext);

    return (
        <>
            <Form onSubmit={registerUser}>
                <Row style={{
                    height: "80vh",
                    justifyContent: "center",
                    paddingTop: "3%"
                }}>
                    <Col xs={6}>
                        <Stack gap={3}>
                            <h2>Register</h2>
                            <Form.Control type="text" placeholder="Name" onChange={(e) => updateRegisterInfo({ ...registerInfo, name: e.target.value })} />
                            <Form.Control type="email" placeholder="email" onChange={(e) => updateRegisterInfo({ ...registerInfo, email: e.target.value })} />
                            <Form.Control type="password" placeholder="password" onChange={(e) => updateRegisterInfo({ ...registerInfo, password: e.target.value })} />
                            <Button variant="primary" type="submit">{isLoading ? "Loading" : "Register"}</Button>

                            {registerError?.error && (
                                <Alert variant="danger"><p>{registerError?.message}</p></Alert>
                            )}
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default Register