import React, { useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import NavigationBar from '../components/NavigationBar'
import { PortNumber } from '../components/PortNumber'

const BootstrapButton = styled(Button)({
  fontSize: 16,
  margin: '20px 12px'
});

// login screen
export default function Login () {
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // login information submit function
  function submitLogin () {
    const postMessage = {
      email,
      password
    }
    fetch(`http://127.0.0.1:${PortNumber}/user/auth/login`, {
      method: 'POST',
      body: JSON.stringify(postMessage),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        if (res.status === 200) {
          res.json().then(data => {
            // save to cookie and jump to home page
            localStorage.setItem('token', data.token)
            localStorage.setItem('userEmail', email)
            navigate('/')
          })
        } else {
          res.json().then(data => {
            alert(data.error)
          })
        }
      })
  }

  return (<>
        <NavigationBar />
        {/* header */}
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            paddingTop='30px'
            paddingBottom='30px'
            style={{ backgroundImage: 'linear-gradient(to right, #412a9d , #d02377)', color: 'white' }}
        >
            <Typography variant="h4">Please login here</Typography>
        </Grid>
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            marginTop='50px'
        >
            {/* email input part */}
            <TextField sx={{ width: '40ch' }}
                required
                margin="normal"
                label="Email"
                id="Email"
                onChange={e => setEmail(e.target.value)}
            />
            {/* password input part */}
            <TextField sx={{ width: '40ch' }}
                required
                margin="normal"
                label="Password"
                type="password"
                id="Password"
                onChange={e => setPassword(e.target.value)}
            />
            {/* login/ to register button */}
            <div>
                <BootstrapButton variant="contained"
                  onClick={submitLogin}
                  name='submit-btn'
                >
                  Submit
                </BootstrapButton>
                <BootstrapButton variant="contained" color="success"
                  onClick={e => { navigate('/register') }}
                  name='to-register-btn'
                >
                    Register
                </BootstrapButton>
            </div>
        </Grid>
    </>)
}
