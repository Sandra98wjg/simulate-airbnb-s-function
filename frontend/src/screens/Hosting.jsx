import React, { useEffect, useState } from 'react'
import NavigationBar from '../components/NavigationBar'
import Button from '@mui/material/Button'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Grid from '@mui/material/Grid'
import { useNavigate } from 'react-router-dom'
import ListingCard from '../components/ListingCard'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { PortNumber } from '../components/PortNumber'

// hosting screen
export default function Hosting () {
  const navigate = useNavigate()
  const [listings, setListings] = useState([])

  // check if user is login or not
  function hostedListingCreate () {
    if (localStorage.getItem('userEmail') === null) {
      navigate('/login')
    } else {
      navigate('/listingcreate')
    }
  }

  useEffect(() => {
    // get all listings
    function getListing () {
      fetch(`http://127.0.0.1:${PortNumber}/listings`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => {
          if (res.status === 200) {
            res.json().then(data => {
              // filter user hosted listings
              const hostedListings = data.listings.filter(listing => (
                listing.owner === localStorage.getItem('userEmail')
              ))
              // get those hosted listings detail
              Promise.all(hostedListings.map(listing => (
                fetch(`http://127.0.0.1:${PortNumber}/listings/${listing.id}`, {
                  method: 'GET',
                  headers: { 'Content-Type': 'application/json' }
                })
                  .then(res => {
                    if (res.status === 200) {
                      return res.json().then(data => {
                        // set average score and listing id to the data
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
                      })
                    }
                  })
              ))).then(data => {
                setListings(data)
              })
            })
          } else {
            res.json().then(data => {
              alert(data.error)
            })
          }
        })
    }
    getListing()
  }, [])

  // generate HostedListings
  function HostedListings () {
    const userHosted = listings.map(listing => (
      (<Grid item key={listing.id} xs={6} sm={4} md={4}>
        <ListingCard
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
      <Box sx={{ flexGrow: 1, textAlign: 'center', marginLeft: '6%' }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {userHosted}
        </Grid>
      </Box>
    </>)
  }

  return (<>
    <NavigationBar />
    {/* header title */}
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      paddingTop='30px'
      paddingBottom='30px'
      style={{ backgroundImage: 'linear-gradient(to right, #412a9d , #d02377)', color: 'white' }}
    >
      <Typography variant="h4">Welcome! Manage your Hosted Listings here</Typography>
    </Grid>
    {/* create new listing button */}
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      padding='20px'
    >
      <Button variant="outlined" color='success' startIcon={<AddCircleIcon />}
        onClick={hostedListingCreate}
        name='create-new-listing-btn'
      >
        Create New Listing
      </Button>
    </Grid>
    {/* listings */}
    <HostedListings />
  </>)
}
