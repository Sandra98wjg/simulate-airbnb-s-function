import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { PortNumber } from './PortNumber'

const NavButton = styled(Button)({
  color: 'black'
})

// when width decrease, let the airbnb image disappear
const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    marginLeft: '3%'
  },
  Button: {
    padding: theme.spacing(0, 4),
  },
  sectionDesktop: {
    marginRight: '3%',
    display: 'flex',
  },
}))

// the navigation bar
export default function NavigationBar () {
  const navigate = useNavigate()
  const classes = useStyles()

  //  function for user to login/log out
  function toLogInOut () {
    if (localStorage.getItem('userEmail') !== null) {
      fetch(`http://127.0.0.1:${PortNumber}/user/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(res => {
          if (res.status === 200) {
            res.json().then(data => {
              localStorage.clear()
              navigate('/login')
            })
          } else {
            res.json().then(data => {
              alert(data.error)
              localStorage.clear()
              navigate('/login')
            })
          }
        })
    } else {
      navigate('/login')
    }
  }

  // if the user is not login, jump to the login screen, else jump to hosting screen
  function toHosting () {
    if (localStorage.getItem('userEmail') === null) {
      navigate('/login')
    } else {
      navigate('/hosting')
    }
  }

  return (
    <div className={classes.grow}>
      <AppBar position="static" style={{ backgroundColor: 'white', color: 'black' }}>
        <Toolbar>
          {/* airbnb image */}
          <Typography className={classes.title} variant="h5">
            <img src='https://www.vectorlogo.zone/logos/airbnb/airbnb-ar21.svg' alt='airbnb' />
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {/* to home page */}
            <NavButton key='explore' className={classes.Button}
              onClick={e => { navigate('/') }}
              name='explore-btn'
            >
              explore
            </NavButton>
            {/* to hosting page */}
            <NavButton key='host' className={classes.Button}
              onClick={toHosting}
              name='host-btn'
            >
              switch to hosting
            </NavButton>
            {/* login/log out button */}
            <NavButton key='login'
              name='login-out-btn'
              className={classes.Button}
              onClick={toLogInOut}
            >
              Login/Log out
            </NavButton>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  )
}
