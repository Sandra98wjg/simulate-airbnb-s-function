import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { useNavigate, useParams } from 'react-router-dom'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Typography from '@mui/material/Typography'
import NavigationBar from '../components/NavigationBar'
import { PortNumber } from '../components/PortNumber'

const BootstrapButton = styled(Button)({
  fontSize: 16,
  margin: '20px 12px'
})

export default function ListingPublish () {
  const navigate = useNavigate()
  const params = useParams()

  const [thumbnail, setThumbnail] = useState('')
  const [title, setTitle] = useState('')
  const [times, setTimes] = useState([])
  const [valueStart, setValueStart] = React.useState(null)
  const [valueEnd, setValueEnd] = React.useState(null)
  const [timeIndex, setTimeIndex] = useState(0)

  useEffect(() => {
    // get listing information to show title and thumbnail
    function getListing () {
      fetch(`http://127.0.0.1:${PortNumber}/listings/${params.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => {
          if (res.status === 200) {
            res.json().then(data => {
              setTitle(data.listing.title)
              setThumbnail(data.listing.thumbnail)
            })
          } else {
            res.json().then(data => {
              alert(data.error)
            })
          }
        })
    }
    getListing()
  }, [params.id])

  // add time range function
  function addTime () {
    const time = [...times]
    time.push({ start: valueStart, end: valueEnd, index: timeIndex })
    setTimes(time)
    setTimeIndex(timeIndex + 1)
  }

  // delete time range function
  function deleteTime () {
    const time = [...times]
    time.pop()
    setTimes(time)
    setTimeIndex(timeIndex - 1)
  }

  // check if the time is available
  function checkTime () {
    for (const time of times) {
      // time start/end cannot be null
      if (time.start === null || time.end === null) {
        return false
      }
      // time end is larger than time start
      if (time.end.diff(time.start, 'day') <= 0) {
        return false
      }
    }
    if (times.length > 1) {
      // check for time conflicts
      for (let i = 0; i < times.length - 1; i++) {
        for (let j = i + 1; j < times.length; j++) {
          // if time end is in other time range
          if (times[j].start.isBetween(times[i].start, times[i].end)) {
            return false
          }
          // if time start is in other time range
          if (times[j].end.isBetween(times[i].start, times[i].end)) {
            return false
          }
          // if this time range contains other time range
          if ((times[j].start.diff(times[i].start, 'day') <= 0) && (times[j].end.diff(times[i].start, 'day') >= 0)) {
            return false
          }
        }
      }
    } else if (times.length < 1) {
      return false
    }
    return true
  }

  // submit times
  function submitPublish () {
    if (checkTime() !== true) {
      alert('Your publish date is invaild')
    } else {
      const postMessage = {
        availability: times
      }
      fetch(`http://127.0.0.1:${PortNumber}/listings/publish/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(postMessage),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(res => {
          if (res.status === 200) {
            res.json().then(data => {
              navigate('/hosting')
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
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      paddingTop='30px'
      paddingBottom='30px'
      style={{ backgroundImage: 'linear-gradient(to right, #412a9d , #d02377)', color: 'white' }}
    >
      <Typography variant="h4">Choose publish date for {title}</Typography>
    </Grid>
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      marginTop='5px'
    >
      <img src={thumbnail} alt={title} width='300px' height='300px' />
      {/* time ranges */}
      {times.map((time) =>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          key={time.index}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start time"
              value={time.start}
              onChange={(newValue) => {
                time.start = newValue
                setValueStart(newValue)
              }}
              renderInput={(params) => <TextField {...params} style={{ margin: '5px' }} name="start-time"/>}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="End time"
              value={time.end}
              onChange={(newValue) => {
                time.end = newValue
                setValueEnd(newValue)
              }}
              renderInput={(params) => <TextField {...params} style={{ margin: '5px' }} name="end-time"/>}
            />
          </LocalizationProvider>
        </Grid>
      )}
      {/* add/delete time button */}
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Button variant="contained" onClick={addTime} style={{ margin: '20px' }}
          name = 'add-time-btn'
        >
          Add Time Range
        </Button>
        <Button variant="contained" color="error" onClick={deleteTime}
          name = 'delete-time-btn'
        >
          Delete Time Range
        </Button>
      </Grid>
      {/* submit all time range */}
      <div>
        <BootstrapButton variant="contained"
          onClick={submitPublish}
          name="submit-btn"
        >
          Submit
        </BootstrapButton>
      </div>
    </Grid>
  </>)
}
