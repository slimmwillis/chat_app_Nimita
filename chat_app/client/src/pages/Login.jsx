import { useContext } from "react"
import { Alert, Button, Col, Form, Row, Stack } from "react-bootstrap"
import { AuthContext } from "../context/AuthContext"

const Login = () => {

    const { loginUser, loginInfo, loginError, isLoginLoading, updateLoginInfo } = useContext(AuthContext);

    return ( 
        <>
            <Form onSubmit={loginUser}>  
                <Row style={{
                    height: "80vh",
                    justifyContent: "center",
                    paddingTop: "3%"
                }}>
                    <Col xs={6}>
                        <Stack gap={3}>
                            <h2>Login</h2>
                            <Form.Control type="email" placeholder="email" onChange={((e) => updateLoginInfo({ ...loginInfo, email: e.target.value }))} />
                            <Form.Control type="password" placeholder="password" onChange={((e) => updateLoginInfo({ ...loginInfo, password: e.target.value }))} />
                            <Button variant="primary" type="submit">{ isLoginLoading ? "Loading..." : "Login"}</Button>

                    {loginError?.error && (
                        <Alert variant="danger"><p>{loginError?.message}</p></Alert>
                    )}
                            
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default Login