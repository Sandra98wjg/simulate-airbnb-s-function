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

// register screen
export default function Register () {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')

  // send register information function
  function submitRegister () {
    if (password !== password2) {
      alert('Two password is not match')
    } else if (email === '') {
      alert('Email cannot be null')
    } else if (name === '') {
      alert('Name cannot be null')
    } else if (password === '') {
      alert('Password cannot be null')
    } else {
      const postMessage = {
        email,
        password,
        name
      }
      fetch(`http://127.0.0.1:${PortNumber}/user/auth/register`, {
        method: 'POST',
        body: JSON.stringify(postMessage),
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => {
          if (res.status === 200) {
            res.json().then(data => {
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
      <Typography variant="h4">Please register here</Typography>
    </Grid>
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      marginTop='50px'
    >
      {/* email */}
      <TextField sx={{ width: '40ch' }}
        required
        margin="normal"
        label="Email"
        id="Email"
        onChange={e => setEmail(e.target.value)}
      />
      {/* name */}
      <TextField sx={{ width: '40ch' }}
        required
        margin="normal"
        label="Name"
        id="Name"
        onChange={e => setName(e.target.value)}
      />
      {/* password */}
      <TextField sx={{ width: '40ch' }}
        required
        margin="normal"
        label="Password"
        type="password"
        id="Password"
        onChange={e => setPassword(e.target.value)}
      />
      {/* password to confirm */}
      <TextField sx={{ width: '40ch' }}
        required
        margin="normal"
        label="Enter Password Again"
        type="password"
        id="Password2"
        onChange={e => setPassword2(e.target.value)}
      />
      {/* back to login/ register button */}
      <div>
        <BootstrapButton variant="contained"
          onClick={submitRegister}
          name='submit-btn'
        >
          Submit
        </BootstrapButton>
        <BootstrapButton variant="contained" color="success"
          onClick={e => { navigate('/login') }}
          name='to-login-btn'
        >
          Login
        </BootstrapButton>
      </div>
    </Grid>
  </>)
}
