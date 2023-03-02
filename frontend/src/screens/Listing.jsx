import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import { useNavigate, useParams } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import SingleBedIcon from '@mui/icons-material/SingleBed'
import Box from '@mui/material/Box'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Modal from '@mui/material/Modal'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import SendIcon from '@material-ui/icons/Send'
import Rating from '@material-ui/lab/Rating'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import { PortNumber } from '../components/PortNumber'

// make screen more readable in 400X700
const useStyles = makeStyles((theme) => ({
  large: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  },
  mobile: {
    display: 'block',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },

}))

// listing detail screen
export default function Listing () {
  const navigate = useNavigate()
  const params = useParams()
  const classes = useStyles()

  const [thumbnail, setThumbnail] = useState('')
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [price, setPrice] = useState(0)
  const [availability, setAvailbility] = useState([])
  const [owner, setOwner] = useState('')
  const [reviews, setReviews] = useState([])
  const [reviewIndex, setReviewIndex] = useState(0)
  const [amenities, setAmenities] = useState([])
  const [bathrooms, setBathrooms] = useState(0)
  const [bedTotal, setBedTotal] = useState(0)
  const [bedroom, setBedroom] = useState([])
  const [propertyType, setPropertyType] = useState('')
  const [bookTimeStart, setBookTimeStart] = useState(null)
  const [bookTimeEnd, setBookTimeEnd] = useState(null)
  const [propertyImages, setPropertyImages] = useState([])
  const [bookingStatus, setBookingStatus] = useState([])
  const [reviewId, setReviewId] = useState('')
  const [reviewInput, setReviewInput] = useState('')
  const [score, setScore] = useState(0)
  const [open, setOpen] = useState(false)

  // style part
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid green',
    boxShadow: 24,
    p: 4,
  }

  // function part
  // check if booking time is available
  function checkTimeAvailable () {
    if (bookTimeStart !== null && bookTimeEnd !== null) {
      if (bookTimeEnd.diff(bookTimeStart, 'day') > 0) {
        for (const availableTime of availability) {
          if (bookTimeStart.diff(availableTime.start, 'day') >= -1 && bookTimeEnd.diff(availableTime.end, 'day') <= 0) {
            return true
          }
        }
      }
    }
    return false
  }

  // booking function
  function booking () {
    if (localStorage.getItem('userEmail') === null) {
      navigate('/login')
    } else {
      if (checkTimeAvailable() === false) {
        alert('your time choose is error')
      } else {
        const postMessage = {
          dateRange: { start: bookTimeStart, end: bookTimeEnd, range: bookTimeEnd.diff(bookTimeStart, 'day') },
          totalPrice: price * bookTimeEnd.diff(bookTimeStart, 'day')
        }
        fetch(`http://127.0.0.1:${PortNumber}/bookings/new/${params.id}`, {
          method: 'POST',
          body: JSON.stringify(postMessage),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        })
          .then(res => {
            if (res.status === 200) {
              res.json().then(data => {
                handleOpen()
              })
            } else {
              res.json().then(data => {
                alert(data.error)
              })
            }
          })
      }
    }
  }

  // send review function
  function sendReview () {
    if (localStorage.getItem('userEmail') === null) {
      navigate('/login')
    } else if (reviewId === '') {
      alert('Only booked user can write review')
    } else {
      if (score === 0) {
        alert('Please rate this listing.')
      } else if (reviewInput === '') {
        alert('Your review cannot be null.')
      } else {
        const postMessage = {
          review: { userEmail: localStorage.getItem('userEmail'), score, comment: reviewInput, index: reviewIndex },
        }
        fetch(`http://127.0.0.1:${PortNumber}/listings/${params.id}/review/${reviewId}`, {
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
                window.location.reload()
              })
            } else {
              res.json().then(data => {
                alert(data.error)
              })
            }
          })
      }
    }
  }

  useEffect(() => {
    // get listing detail
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
              setAddress(data.listing.address)
              setAvailbility(data.listing.availability)
              setOwner(data.listing.owner)
              setPrice(Number(data.listing.price))
              setReviews(data.listing.reviews)
              setReviewIndex(data.listing.reviews.length)
              // meta data
              setAmenities(data.listing.metadata.amenities)
              setBathrooms(Number(data.listing.metadata.bathroom))
              setBedTotal(data.listing.metadata.bedTotal)
              setBedroom(data.listing.metadata.bedroom)
              setPropertyType(data.listing.metadata.propertyType)
              setPropertyImages(data.listing.metadata.propertyImages)
            })
          } else {
            res.json().then(data => {
              alert(data.error)
            })
          }
        })
    }
    // get user this listing's booking status
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
              const ownerBooking = data.bookings
                .filter(booking => (booking.owner === localStorage.getItem('userEmail')))
                .filter(booking => (booking.listingId === params.id))
              setBookingStatus(ownerBooking)
              // get a accepted bookingId for send review
              let bookingId = ''
              for (const booking of ownerBooking) {
                if (booking.status === 'accepted') {
                  bookingId = booking.id
                }
              }
              setReviewId(bookingId)
            })
          } else {
            res.json().then(data => {
              alert(data.error)
            })
          }
        })
    }
    getListing()
    if (localStorage.getItem('userEmail') !== null) {
      getBookings()
    }
  }, [params.id])

  // components part
  // bedroom part
  function BedroomTotal () {
    const bedInfo = bedroom.map(eachBedroom => (
      (<Grid item key={eachBedroom.index} xs={6} sm={4} md={4}>
        <Card sx={{ width: 160, height: 120, borderRadius: '5%' }}>
          <CardContent>
            <SingleBedIcon />
            <Typography variant="h6">{eachBedroom.bedroomType}</Typography>
            <Typography>{eachBedroom.number} bed</Typography>
          </CardContent>
        </Card>
      </Grid>
      )
    ))
    return (<>
      <Box sx={{ flexGrow: 1, textAlign: 'center' }} mt={1} ml={6} >
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {bedInfo}
        </Grid>
      </Box>
    </>)
  }
  // amenities part
  function AmenitiesTotal () {
    let amenitiesInfo = ''
    if (amenities.length > 0) {
      amenitiesInfo = amenities.map(amenity => (
        (<Grid item key={amenity} xs={6}>
          <Typography>{amenity}</Typography>
        </Grid>
        )
      ))
    } else {
      amenitiesInfo = (<Typography style={{ marginLeft: '5px' }}>No infortmaion</Typography>)
    }

    return (<>
      <Box sx={{ flexGrow: 1 }} mt={1}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {amenitiesInfo}
        </Grid>
      </Box>
    </>)
  }
  // listing information part
  function ListingInfo () {
    return (<>
      <Typography variant="h5" marginTop='20px'>Room in {propertyType} hosted by {owner}</Typography>
      <Typography>{bedroom.length} bedroom • {bedTotal} bed • {bathrooms} bath</Typography>
      <Typography>Address: {address}</Typography>
      <Divider style={{ marginTop: '20px', marginBottom: '20px' }} />
      <Typography variant="h5">Price</Typography>
      <Typography>Price(per night): ${price} AUD</Typography>
      <Typography
        style={(localStorage.getItem('timeRange') !== '') ? { display: 'block' } : { display: 'none' }}
      >
        Price: ${price * Number(localStorage.getItem('daysNum'))} AUD for your date range: {localStorage.getItem('timeRange')}</Typography>
      <Divider style={{ marginTop: '20px', marginBottom: '20px' }} />
      <Typography variant="h5" >What this place offers</Typography>
      <AmenitiesTotal />
      <Divider style={{ marginTop: '20px', marginBottom: '20px' }} />
      <Typography variant="h5">Where you&#39;ll sleep</Typography>
    </>)
  }
  // booking part
  function BookingCard () {
    const availableTime = availability.map(time => (
      (<Typography key={time.start} sx={{ fontSize: 10 }} color="text.secondary">
        {new Date(time.start).toLocaleString('en-US', { dateStyle: 'medium' })} - {new Date(time.end).toLocaleString('en-US', { dateStyle: 'medium' })}
      </Typography>
      )
    ))
    return (<>
      <Card sx={{ minWidth: 325, maxWidth: 400 }}>
        <CardContent>
          <Typography variant="h6">Booking </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            ${price} AUD / day
          </Typography>
          <Typography>Available time:</Typography>
          {availableTime}
          <Typography mb={1}>Choose your booking time:</Typography>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Check-in"
                value={bookTimeStart}
                onChange={(newValue) => {
                  setBookTimeStart(newValue)
                }}
                renderInput={(params) => <TextField {...params} style={{ width: '145px' }} name="start-time"/>}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Checkout"
                value={bookTimeEnd}
                onChange={(newValue) => {
                  setBookTimeEnd(newValue)
                }}
                renderInput={(params) => <TextField {...params} style={{ width: '145px' }} name="end-time"/>}
              />
            </LocalizationProvider>
          </Box>
          <Typography sx={{ fontSize: 14 }}
            style={(checkTimeAvailable() === true) ? { display: 'block' } : { display: 'none' }}
          >
            Total: ${price * ((checkTimeAvailable() === true) ? bookTimeEnd.diff(bookTimeStart, 'day') : 0)} AUD</Typography>
        </CardContent>
        <CardActions>
          <Button size="small" variant="contained"
            style={{ marginLeft: '26%', marginBottom: '10px' }}
            onClick={booking}
            name="booking-btn"
          >
            Confirm Booking
          </Button>
        </CardActions>
      </Card>
    </>)
  }
  // booking status part
  function BookingTotal () {
    const bookingInfo = bookingStatus.map(booking => (
      (<div key={booking.id}>
        <Typography sx={{ fontSize: 14 }} color="text.secondary">
          Booking date:&nbsp;
          {new Date(booking.dateRange.start).toLocaleString('en-US', { dateStyle: 'medium' })}
          &nbsp;-&nbsp;
          {new Date(booking.dateRange.end).toLocaleString('en-US', { dateStyle: 'medium' })}
        </Typography>
        <Typography sx={{ fontSize: 14, marginBottom: '10px' }}>
          Booking Status: {booking.status}
        </Typography>
      </div>
      )
    ))
    return (<>
      <Divider style={{ marginTop: '20px', marginBottom: '20px' }} />
      <Typography variant="h5">Your Booking Status</Typography>
      {bookingInfo}
    </>)
  }

  // review part
  function ReviewTotal () {
    const reviewInfo = reviews.map(review => (
      (<div key={review.index} style={{ marginLeft: '15px', marginBottom: '10px' }}>
        <Typography variant="h6" style={{ margin: '5px 0' }}>{review.userEmail}
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Rating name="read-only" value={review.score} readOnly size="small" />
        </Typography>
        <Typography sx={{ fontSize: 14, marginLeft: '15px' }}>{review.comment}</Typography>
      </div>)
    ))
    return (<>
      <Divider style={{ marginTop: '20px', marginBottom: '20px' }} />
      <Typography variant="h5">Review</Typography>
      {reviewInfo}
    </>)
  }

  // Property Images part
  function PropertyImagesTotal () {
    const imagesList = propertyImages.map((image) => (
      <ImageListItem key={image.index}>
        <img
          src={image.imageUrl}
          srcSet={image.imageUrl}
          alt={image.index}
          loading="lazy"
        />
      </ImageListItem>
    ))
    return (<>
      <Typography variant="h5">Property Images</Typography>
      <ImageList sx={{ width: '100%', height: '300%' }} cols={3} rowHeight={164}>
        {imagesList}
      </ImageList>
    </>)
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
      mb={3}
    >
      <Typography variant="h3">{title}</Typography>
    </Grid>
    <Paper elevation={0}
      sx={{ p: 2, margin: 'auto', maxWidth: 1100, flexGrow: 1, }}
    >
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <img src={thumbnail} alt={title} width='350px' height='350px' style={{ borderRadius: '20px' }} />
      </Grid>
    </Paper>
    {/* if is large screen */}
    <Paper elevation={0} className={classes.large}
      sx={{ p: 2, margin: 'auto', maxWidth: 1100, flexGrow: 1, }}
    >
      <Grid item xs={12} container wrap="nowrap" spacing={2} >
        <Grid container xs={8} direction="column">
          <div style={{ paddingLeft: '15%' }}>
            <ListingInfo />
            <BedroomTotal />
            <ReviewTotal />
            {/* input review and score part */}
            <Paper
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', minWidth: 350, marginBottom: '20px' }}
            >
              <Box component="fieldset" borderColor="transparent">
                <Rating
                  name="simple-controlled"
                  value={score}
                  onChange={(event, newValue) => {
                    setScore(newValue)
                  }}
                />
              </Box>
              <InputBase
                sx={{ ml: 2, flex: 1 }}
                value={reviewInput}
                placeholder="Your reviews about this listing"
                inputProps={{ 'aria-label': 'Review' }}
                onChange={e => { setReviewInput(e.target.value) }}
              />
              <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={sendReview}>
                <SendIcon />
              </IconButton>
            </Paper>
          </div>
        </Grid>
        <Grid item xs={4}>
          <BookingCard />
          <BookingTotal />
        </Grid>
      </Grid>
    </Paper>
    {/* if is a smail screen */}
    <Paper elevation={0} className={classes.mobile}
      sx={{ p: 2, margin: 'auto', maxWidth: 1100, flexGrow: 1, }}
    >
      <Grid item xs={12} container wrap="nowrap" spacing={2}
        direction="column"
      >
        <div style={{ paddingLeft: '15%' }}>
          <ListingInfo />
          <BedroomTotal />
          <BookingCard />
          <BookingTotal />
          <ReviewTotal />
        </div>
        {/* input review and score part */}
        <div style={{ paddingLeft: '5%' }}>
          <Paper
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', minWidth: 350, marginBottom: '20px' }}
          >
            <Box component="fieldset" borderColor="transparent">
              <Rating
                name="simple-controlled"
                value={score}
                onChange={(event, newValue) => {
                  setScore(newValue)
                }}
                size='small'
              />
            </Box>
            <InputBase
              sx={{ flex: 1 }}
              value={reviewInput}
              placeholder="Your reviews about this listing"
              inputProps={{ 'aria-label': 'Review' }}
              onChange={e => { setReviewInput(e.target.value) }}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={sendReview}>
              <SendIcon />
            </IconButton>
          </Paper>
        </div>
      </Grid>
    </Paper>
    {/* Property Images part */}
    <Paper elevation={0}
      sx={{ p: 2, margin: 'auto', maxWidth: 1100, flexGrow: 1, }}
    >
      <Grid style={{ marginLeft: '9%', height: '130px' }}>
        <PropertyImagesTotal />
      </Grid>
    </Paper>
    {/* when sending a booking success, open this modal */}
    <Modal
      open={open}
      onClose={e => {
        handleClose()
        window.location.reload()
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Booking Success
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Your booking request is send to the host, please wait for hoster to confirm.
        </Typography>
      </Box>
    </Modal>
  </>)
}
