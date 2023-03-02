import React, { useEffect, useState } from 'react'
import NavigationBar from '../components/NavigationBar'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContentText from '@mui/material/DialogContentText'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import ListingShowCard from '../components/ListingShowCard'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import { PortNumber } from '../components/PortNumber'

export default function Landing () {
  const [listings, setListings] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [filtered, setFiltered] = useState([])
  const [open, setOpen] = useState(false)
  const [filterMinBedroom, setFilterMinBedroom] = useState(0)
  const [filterMaxBedroom, setFilterMaxBedroom] = useState(0)
  const [filterTimeStart, setFilterTimeStart] = useState(null)
  const [filterTimeEnd, setFilterTimeEnd] = useState(null)
  const [filterMinPrice, setFilterMinPrice] = useState(0)
  const [filterMaxPrice, setFilterMaxPrice] = useState(0)
  const [sortBy, setSortBy] = useState('')
  const [bookingList, setBookingList] = useState([])
  const [searchFilter, setSearchFilter] = useState(false)

  // close filter part
  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      setOpen(false)
    }
  }

  // search function
  function search () {
    localStorage.setItem('daysNum', '')
    localStorage.setItem('timeRange', '')
    setSearchFilter(true)
    const searchStrings = searchInput.toLocaleLowerCase().split(' ')
    let listingFilter = []
    // search at title, address and property type
    for (const listing of listings) {
      for (let i = 0; i < searchStrings.length; i++) {
        if (listing.title.toLowerCase().indexOf(searchStrings[i]) !== -1) {
          listingFilter.push(listing)
          break
        }
        if (listing.address.toLowerCase().indexOf(searchStrings[i]) !== -1) {
          listingFilter.push(listing)
          break
        }
        if (listing.metadata.propertyType.toLowerCase().indexOf(searchStrings[i]) !== -1) {
          listingFilter.push(listing)
          break
        }
      }
    }
    // remove duplicate listings
    listingFilter = Array.from(new Set(listingFilter))
    setFiltered(listingFilter)
    setSearchInput('')
  }

  // filter function
  function filter () {
    setSearchFilter(true)
    if (filterMinBedroom > filterMaxBedroom || filterMinBedroom < 0 || filterMaxBedroom < 0) {
      alert('Filter bedroom number is wrong')
    } else if (filterMinPrice > filterMaxPrice || filterMinPrice < 0 || filterMaxPrice < 0) {
      alert('Filter price range is wrong')
    } else if (filterTimeStart !== null && filterTimeEnd !== null) {
      // if didn't set date range search
      if (filterTimeEnd.diff(filterTimeStart, 'day') < 0) {
        alert('Filter time range is wrong')
      } else {
        // put date range to localStorage for display price per stay
        const start = new Date(filterTimeStart).toLocaleString('en-US', { dateStyle: 'medium' })
        const end = new Date(filterTimeEnd).toLocaleString('en-US', { dateStyle: 'medium' })
        localStorage.setItem('daysNum', filterTimeEnd.diff(filterTimeStart, 'day') + 1)
        localStorage.setItem('timeRange', start + ' - ' + end)
        let listingFilter = listings
        // filter bedroom part
        if (filterMaxBedroom > 0) {
          listingFilter = listingFilter.filter(listing => (
            filterMaxBedroom >= listing.metadata.bedroom.length && listing.metadata.bedroom.length >= filterMinBedroom
          ))
        }
        // filter price part
        if (filterMaxPrice > 0) {
          listingFilter = listingFilter.filter(listing => (
            filterMaxPrice >= Number(listing.price) && Number(listing.price) >= filterMinBedroom
          ))
        }
        // filter time part
        let listingFilterTime = []
        for (const listing of listingFilter) {
          for (const availableTime of listing.availability) {
            if (filterTimeStart.diff(availableTime.start, 'day') >= -1 && filterTimeEnd.diff(availableTime.end, 'day') < 0) {
              listingFilterTime.push(listing)
            }
          }
        }
        listingFilterTime = Array.from(new Set(listingFilterTime))
        // filter review score part
        if (sortBy === 'high') {
          listingFilterTime = listingFilterTime.sort(function (a, b) {
            return b.score - a.score
          })
        }
        if (sortBy === 'low') {
          listingFilterTime = listingFilterTime.sort(function (a, b) {
            return a.score - b.score
          })
        }
        setFiltered(listingFilterTime)
        setFilterMinBedroom(0)
        setFilterMaxBedroom(0)
        setFilterTimeStart(null)
        setFilterTimeEnd(null)
        setFilterMinPrice(0)
        setFilterMaxPrice(0)
        setOpen(false)
        setSortBy('')
      }
    } else if (filterTimeStart === null && filterTimeEnd === null) {
      localStorage.setItem('daysNum', '')
      localStorage.setItem('timeRange', '')
      let listingFilter = listings
      // filter bedroom part
      if (filterMaxBedroom > 0) {
        listingFilter = listingFilter.filter(listing => (
          filterMaxBedroom >= listing.metadata.bedroom.length && listing.metadata.bedroom.length >= filterMinBedroom
        ))
      }
      // filter price part
      if (filterMaxPrice > 0) {
        listingFilter = listingFilter.filter(listing => (
          filterMaxPrice >= Number(listing.price) && Number(listing.price) >= filterMinBedroom
        ))
      }
      // filter review score part
      if (sortBy === 'high') {
        listingFilter = listingFilter.sort(function (a, b) {
          return b.score - a.score
        })
      }
      if (sortBy === 'low') {
        listingFilter = listingFilter.sort(function (a, b) {
          return a.score - b.score
        })
      }
      setFiltered(listingFilter)
      setFilterMinBedroom(0)
      setFilterMaxBedroom(0)
      setFilterTimeStart(null)
      setFilterTimeEnd(null)
      setFilterMinPrice(0)
      setFilterMaxPrice(0)
      setOpen(false)
      setSortBy('')
    } else {
      alert('Filter time range is wrong')
    }
  }

  useEffect(() => {
    // get total listings
    function getListing () {
      fetch(`http://127.0.0.1:${PortNumber}/listings`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => {
          if (res.status === 200) {
            res.json().then(data => {
              // get each listing's detail
              Promise.all(data.listings.map(listing => (
                fetch(`http://127.0.0.1:${PortNumber}/listings/${listing.id}`, {
                  method: 'GET',
                  headers: { 'Content-Type': 'application/json' }
                })
                  .then(res => {
                    if (res.status === 200) {
                      return res.json().then(data => {
                        let scoreTotal = 0
                        for (const review of data.listing.reviews) {
                          scoreTotal += review.score
                        }
                        data.listing.score = (data.listing.reviews.length !== 0) ? (scoreTotal / data.listing.reviews.length).toFixed(2) : 0
                        data.listing.id = listing.id
                        return data.listing
                      })
                    } else {
                      return res.json().then(data => {
                        alert(data.error)
                        localStorage.clear()
                      })
                    }
                  })
              ))).then(data => {
                // filter userself hosted listing and sort by title's alphabetical order
                const publishedListings = data
                  .filter(listing => (listing.owner !== localStorage.getItem('userEmail')))
                  .filter(listing => (listing.published === true))
                  .sort(function (a, b) {
                    return a.title.localeCompare(b.title)
                  })
                setListings(publishedListings)
                setFiltered(publishedListings)
                localStorage.setItem('daysNum', '')
                localStorage.setItem('timeRange', '')
              })
            })
          } else {
            res.json().then(data => {
              alert(data.error)
              localStorage.clear()
            })
          }
        })
    }
    // get booking status to put status accepted or pending should appear first in the list
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
              let ownerBooking = data.bookings
                .filter(booking => (booking.owner === localStorage.getItem('userEmail')))
                .filter(booking => (booking.status !== 'declined'))
                .map(booking => (Number(booking.listingId)))
              ownerBooking = Array.from(new Set(ownerBooking))
              setBookingList(ownerBooking)
            })
          } else {
            res.json().then(data => {
              localStorage.clear()
            })
          }
        })
    }
    getListing()
    // only login user can get booking detail
    if (localStorage.getItem('userEmail') !== null) {
      getBookings()
    }
  }, [])

  // set listings card
  function Listings () {
    if (filtered.length !== 0) {
      // if didn't search or filter, let accepted/pending listings display first
      if (!searchFilter) {
        const statusListing = filtered.filter(listing => (bookingList.indexOf(listing.id) !== -1))
          .map(listing => (
            (<Grid item key={listing.id} xs={6} sm={4} md={4}>
              <ListingShowCard
                id={listing.id}
                title={listing.title}
                propertyType={listing.metadata.propertyType}
                bathroom={listing.metadata.bathroom}
                bedNum={listing.metadata.bedTotal}
                thumbnail={listing.thumbnail}
                score={listing.score}
                reviewNum={listing.reviews.length}
                price={listing.price}
              />
            </Grid>
            )
          ))
        // not accepted/pending listings
        const nonStatusListing = filtered.filter(listing => (bookingList.indexOf(listing.id) === -1))
          .map(listing => (
            (<Grid item key={listing.id} xs={6} sm={4} md={4}>
              <ListingShowCard
                id={listing.id}
                title={listing.title}
                propertyType={listing.metadata.propertyType}
                bathroom={listing.metadata.bathroom}
                bedNum={listing.metadata.bedTotal}
                thumbnail={listing.thumbnail}
                score={listing.score}
                reviewNum={listing.reviews.length}
                price={listing.price}
              />
            </Grid>
            )
          ))
        return (<>
          <Box sx={{ flexGrow: 1, textAlign: 'center', marginLeft: '6%' }} mt={7}>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {statusListing}
              {nonStatusListing}
            </Grid>
          </Box>
        </>)
      } else {
        // if search/filter something=>display as request
        const statusListing = filtered
          .map(listing => (
            (<Grid item key={listing.id} xs={6} sm={4} md={4}>
              <ListingShowCard
                id={listing.id}
                title={listing.title}
                propertyType={listing.metadata.propertyType}
                bathroom={listing.metadata.bathroom}
                bedNum={listing.metadata.bedTotal}
                thumbnail={listing.thumbnail}
                score={listing.score}
                reviewNum={listing.reviews.length}
                price={listing.price}
              />
            </Grid>
            )
          ))
        return (<>
          <Box sx={{ flexGrow: 1, textAlign: 'center', marginLeft: '6%' }} mt={7}>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {statusListing}
            </Grid>
          </Box>
        </>)
      }
    } else {
      // if no listing in this screen or search/filter back is none
      return (<>
        <Box sx={{ flexGrow: 1, textAlign: 'center' }} mt={7}>
          <Grid container direction="row" justifyContent="center" alignItems="center">
            <h1>No Result</h1>
          </Grid>
        </Box>
      </>)
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
      {/* search part */}
      <Paper
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 380 }}
      >
        <InputBase
          sx={{ ml: 2, flex: 1 }}
          value={searchInput}
          placeholder="Search title, location and properties"
          inputProps={{ 'aria-label': 'Search title, location and properties' }}
          onChange={e => setSearchInput(e.target.value)}

        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={search}>
          <SearchIcon />
        </IconButton>
      </Paper>
      {/* filter part */}
      <div>
        <Button onClick={e => { setOpen(true) }} style={{ color: 'white', borderColor: 'white', marginTop: '20px' }} variant="outlined">Filter</Button>
        <Dialog maxWidth={'lg'} open={open} onClose={handleClose}>
          <DialogTitle>Filters</DialogTitle>
          {/* bedroom filter */}
          <DialogContent>
            <DialogContentText>
              Bedroom Number Range
            </DialogContentText>
            <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <TextField
                style={{ margin: '5px' }}
                type='number'
                label="min bedroom number"
                id="min-bedroom"
                onChange={e => setFilterMinBedroom(Number(e.target.value))}
              />
              <TextField
                style={{ margin: '5px' }}
                type='number'
                label="max bedroom number"
                id="max-bedroom"
                onChange={e => setFilterMaxBedroom(Number(e.target.value))}
              />
            </Box>
          </DialogContent>
          {/* date range filter */}
          <DialogContent>
            <DialogContentText>
              Date Range
            </DialogContentText>
            <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start time"
                  value={filterTimeStart}
                  onChange={(newValue) => {
                    setFilterTimeStart(newValue)
                  }}
                  renderInput={(params) => <TextField {...params} style={{ margin: '5px' }} />}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End time"
                  value={filterTimeEnd}
                  onChange={(newValue) => {
                    setFilterTimeEnd(newValue)
                  }}
                  renderInput={(params) => <TextField {...params} style={{ margin: '5px' }} />}
                />
              </LocalizationProvider>
            </Box>
          </DialogContent>
          {/* price filter */}
          <DialogContent>
            <DialogContentText>
              Price(per night) Range
            </DialogContentText>
            <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <TextField
                style={{ margin: '5px' }}
                type='number'
                label="min price"
                id="min-price"
                onChange={e => setFilterMinPrice(Number(e.target.value))}
              />
              <TextField
                style={{ margin: '5px' }}
                type='number'
                label="max price"
                id="max-price"
                onChange={e => setFilterMaxPrice(Number(e.target.value))}
              />
            </Box>
          </DialogContent>
          {/* sort by rating filter */}
          <DialogContent>
            <DialogContentText>
              Sort by Review ratings
            </DialogContentText>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <FormControlLabel value="high" control={<Radio />} label="high to low" />
                <FormControlLabel value="low" control={<Radio />} label="low to high" />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={filter}>Ok</Button>
          </DialogActions>
        </Dialog>
      </div>
    </Grid>
    <Listings />
  </>)
}
