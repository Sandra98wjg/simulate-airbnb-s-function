import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import { useParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import NavigationBar from '../components/NavigationBar'
import { PortNumber } from '../components/PortNumber'

// create booking information list data
function createData (id, user, startDate, endDate, totalPrice, status) {
  return { id, user, startDate, endDate, totalPrice, status }
}

// manage booking information and listing profits information screen
export default function Managebooking () {
  const params = useParams()

  const [title, setTitle] = useState('')
  const [pendingBookingList, setPendingBookingList] = useState([])
  const [pastBookingList, setPastBookingList] = useState([])
  const [published, setPublished] = useState(false)
  const [postedOn, setPostedOn] = useState(null)
  const [bookingDays, setBookingDays] = useState(0)
  const [profit, setProfit] = useState(0)

  // for pending listings waiting for host check
  const rowsPending = pendingBookingList.map(booking => {
    return createData(booking.id, booking.owner,
      new Date(booking.dateRange.start).toLocaleString('en-US', { dateStyle: 'medium' }),
      new Date(booking.dateRange.end).toLocaleString('en-US', { dateStyle: 'medium' }),
      booking.totalPrice, booking.status)
  })
  // for history booking
  const rowsPast = pastBookingList.map(booking => {
    return createData(booking.id, booking.owner,
      new Date(booking.dateRange.start).toLocaleString('en-US', { dateStyle: 'medium' }),
      new Date(booking.dateRange.end).toLocaleString('en-US', { dateStyle: 'medium' }),
      booking.totalPrice, booking.status)
  })
  // accept a booking
  function accept (id) {
    fetch(`http://127.0.0.1:${PortNumber}/bookings/accept/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => {
        if (res.status === 200) {
          res.json().then(data => {
            window.location.reload()
          })
        } else {
          res.json().then(data => {
            alert(data.error)
          })
        }
      })
  }
  // decline a booking
  function decline (id) {
    fetch(`http://127.0.0.1:${PortNumber}/bookings/decline/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => {
        if (res.status === 200) {
          res.json().then(data => {
            window.location.reload()
          })
        } else {
          res.json().then(data => {
            alert(data.error)
          })
        }
      })
  }

  useEffect(() => {
    // get this listing's information
    function getListing () {
      fetch(`http://127.0.0.1:${PortNumber}/listings/${params.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => {
          if (res.status === 200) {
            res.json().then(data => {
              setTitle(data.listing.title)
              setPublished(data.listing.published)
              setPostedOn(data.listing.postedOn)
            })
          } else {
            res.json().then(data => {
              alert(data.error)
            })
          }
        })
    }
    // get this listing's booking information
    function getBookings () {
      fetch(`http://127.0.0.1:${PortNumber}/bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(res => {
          if (res.status === 200) {
            res.json().then(data => {
              // filter this listing's bookings
              const thisListingBooking = data.bookings.filter(booking => (booking.listingId === params.id))
              // filter status is pending's bookings
              const pendingBooking = thisListingBooking.filter(booking => (booking.status === 'pending'))
              setPendingBookingList(pendingBooking)
              // filter history bookings
              const pastBooking = thisListingBooking.filter(booking => (booking.status !== 'pending'))
              setPastBookingList(pastBooking)
              // get all accepted bookings to calculate days and profits in this year
              const acceptedBooking = thisListingBooking.filter(booking => (booking.status === 'accepted'))
              let dayTotal = 0
              let profitTotal = 0
              // get year
              const year = new Date().getFullYear()
              for (const booking of acceptedBooking) {
                // if booking's end date in this year
                if (new Date(`12/31/${year}`) >= new Date(booking.dateRange.end) && new Date(booking.dateRange.end) >= new Date(`01/01/${year}`)) {
                  // if booking's start date in this year=>calculate all date and total price
                  if (new Date(`01/01/${year}`) <= new Date(booking.dateRange.start)) {
                    dayTotal += Number(booking.dateRange.range)
                    profitTotal += Number(booking.totalPrice)
                  } else {
                    // id booking's start date not in this year=>calculate days that not in this year and minus them
                    const dayDiff = Math.floor((new Date(`01/01/${year}`).getTime() - new Date(booking.dateRange.start).getTime()) / (1000 * 60 * 60 * 24))
                    dayTotal = Number(booking.dateRange.range) - dayDiff
                    profitTotal += Number(booking.totalPrice) / Number(booking.dateRange.range) * (Number(booking.dateRange.range) - dayDiff)
                  }
                } else if (new Date(booking.dateRange.end) > new Date(`12/31/${year}`)) {
                  // if booking's end date not in this year
                  if (new Date(`01/01/${year}`) <= new Date(booking.dateRange.start) && new Date(booking.dateRange.start) <= new Date(`12/31/${year}`)) {
                    // if booking's start date in this year=>calculate days that not in this year and minus them
                    const dayDiff = Math.floor((new Date(booking.dateRange.end).getTime() - new Date(`12/31/${year}`).getTime()) / (1000 * 60 * 60 * 24))
                    dayTotal = Number(booking.dateRange.range) - dayDiff
                    profitTotal += Number(booking.totalPrice) / Number(booking.dateRange.range) * (Number(booking.dateRange.range) - dayDiff)
                  } else if (new Date(`01/01/${year}`) > new Date(booking.dateRange.start)) {
                    // if booking date range is total year
                    const days = Math.floor((new Date(`12/31/${year}`).getTime() - new Date(`01/01/${year}`).getTime()) / (1000 * 60 * 60 * 24))
                    dayTotal += days
                    profitTotal += Number(booking.totalPrice) / Number(booking.dateRange.range) * days
                  }
                }
              }
              setBookingDays(dayTotal)
              setProfit(profitTotal)
            })
          } else {
            res.json().then(data => {
              alert(data.error)
            })
          }
        })
    }
    getListing()
    getBookings()
  }, [params.id, postedOn])

  // booking requests table head
  function TableHeads () {
    return (<>
      <TableHead>
        <TableRow>
          <TableCell>Request id</TableCell>
          <TableCell align='right'>User Email</TableCell>
          <TableCell align='right'>Start Date</TableCell>
          <TableCell align='right'>End Date</TableCell>
          <TableCell align='right'>Total Price</TableCell>
          <TableCell align='right'>Accept/Decline</TableCell>
        </TableRow>
      </TableHead>
    </>)
  }
  // bookings waiting for accept/decline=>last column is accept and decline button
  function Pending () {
    return (<>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label='simple table'>
          <TableHeads />
          <TableBody>
            {rowsPending.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component='th' scope='row'>
                  {row.id}
                </TableCell>
                <TableCell align='right'>{row.user}</TableCell>
                <TableCell align='right'>{row.startDate}</TableCell>
                <TableCell align='right'>{row.endDate}</TableCell>
                <TableCell align='right'>{row.totalPrice}</TableCell>
                <TableCell align='right'>
                  <ButtonGroup variant='outlined' aria-label='outlined button group' size='small'>
                    <Button color='success' onClick={e => { e.preventDefault(); accept(row.id) }}>Accept</Button>
                    <Button color='error' onClick={e => { e.preventDefault(); decline(row.id) }}>Decline</Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>)
  }

  // bookings history=>last column is accept/decline status
  function Past () {
    return (<>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label='simple table'>
          <TableHeads />
          <TableBody>
            {rowsPast.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component='th' scope='row'>
                  {row.id}
                </TableCell>
                <TableCell align='right'>{row.user}</TableCell>
                <TableCell align='right'>{row.startDate}</TableCell>
                <TableCell align='right'>{row.endDate}</TableCell>
                <TableCell align='right'>{row.totalPrice}</TableCell>
                <TableCell align='right'>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>)
  }

  return (<>
    <NavigationBar />
    <Grid
      container
      direction='column'
      justifyContent='center'
      alignItems='center'
      paddingTop='30px'
      paddingBottom='30px'
      style={{ backgroundImage: 'linear-gradient(to right, #412a9d , #d02377)', color: 'white' }}
    >
      <Typography variant='h4'>Manage your booking request for {title}</Typography>
    </Grid>
    {/* listing information */}
    <div style={{ maxWidth: '1000px', margin: 'auto', padding: '50px 0' }}>
      <Typography variant='h5'>Listing Information</Typography>
      <Grid
        container
        direction='column'
        justifyContent='center'
        alignItems='center'
      >
        {/* if it is a published listing */}
        <Grid
          container
          direction='column'
          style={(published) ? { display: 'block' } : { display: 'none' }}
        >
          <Typography >The listing been up
            online {Math.floor((new Date().getTime() - new Date(postedOn).getTime()) / (1000 * 60 * 60 * 24))} days
            since {new Date(postedOn).toLocaleString('en-US', { dateStyle: 'long' })}.</Typography>
          <Typography >The listing has been booked for {bookingDays} days in this year.</Typography>
          <Typography >The listing has made ${profit} AUD in this year.</Typography>
        </Grid>
        {/* if this listing is not published */}
        <Grid
          container
          direction='column'
          style={(published) ? { display: 'none' } : { display: 'block' }}
        >
          <Typography >The listing haven&#39;t been published yet.</Typography>
        </Grid>
      </Grid>
    </div>
    {/* pending booking */}
    <div style={{ maxWidth: '1000px', margin: 'auto', paddingBottom: '50px' }}>
      <Typography variant='h5'>Booking requests that waiting for manage</Typography>
      <Pending />
    </div>
    {/* booking history */}
    <div style={{ maxWidth: '1000px', margin: 'auto' }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography variant='h5'>Booking requests history</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Past />
        </AccordionDetails>
      </Accordion>
    </div>
  </>)
}
