import React from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useNavigate } from 'react-router-dom'
import PublicIcon from '@mui/icons-material/Public'
import PublicOffIcon from '@mui/icons-material/PublicOff'
import PriceCheckIcon from '@mui/icons-material/PriceCheck'
import Tooltip from '@mui/material/Tooltip'
import StarIcon from '@mui/icons-material/Star'
import { PortNumber } from './PortNumber'
import PropTypes from 'prop-types'

// This card is displayed at hosting screen
export default function ListingCard (props) {
  const navigate = useNavigate()

  // delete listing function
  function deleteListing () {
    fetch(`http://127.0.0.1:${PortNumber}/listings/${props.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => {
        if (res.status === 200) {
          res.json().then(data => {
            // refresh the hosting screen
            window.location.reload()
          })
        } else {
          res.json().then(data => {
            alert(data.error)
          })
        }
      })
  }

  // unpublish listing
  function removePublishListing () {
    fetch(`http://127.0.0.1:${PortNumber}/listings/unpublish/${props.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => {
        if (res.status === 200) {
          res.json().then(data => {
            // refresh the hosting screen
            window.location.reload()
          })
        } else {
          res.json().then(data => {
            alert(data.error)
          })
        }
      })
  }

  return (
  // the listing card (different to listing show card: modify/delete...)
  <Card sx={{ maxWidth: 345 }}>
  {/* head */}
  <CardHeader
    title={props.title}
  />
  <Typography variant="body2" color="text.secondary">
    {props.propertyType}<br />
    Beds: {props.bedNum}  / Bathrooms: {props.bathroom}
  </Typography>
  {/* thumbnail */}
    <CardMedia
      component="img"
      height="194"
      image={props.thumbnail}
      alt={props.title}
    />
    {/* other information */}
    <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
      <Typography variant="body2" color="text.secondary">
        <StarIcon fontSize="15px" />{props.score} (5.0)<br />
        {props.reviewNum} reviews<br />
        Price (per night): {props.price}
      </Typography>
    </CardContent>
    {/* actions that hoster can manipulate this listing */}
    <CardActions sx={{ justifyContent: 'center' }}>
      <Tooltip title="Edit">
        <IconButton aria-label="edit" onClick={e => { navigate(`/listingedit/${props.id}`) }}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton aria-label="delete" onClick={deleteListing} >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Publish">
        <IconButton aria-label="golive" onClick={e => { navigate(`/listingpublish/${props.id}`) }}>
          <PublicIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Unpublish">
        <IconButton aria-label="unpublish" onClick={removePublishListing}>
          <PublicOffIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Manage booking">
        <IconButton aria-label="Managing Booking Requests" onClick={e => { navigate(`/managebooking/${props.id}`) }} >
          <PriceCheckIcon />
        </IconButton>
      </Tooltip>
    </CardActions>
  </Card>
  )
}
ListingCard.propTypes = {
  id: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  propertyType: PropTypes.node.isRequired,
  bedNum: PropTypes.node.isRequired,
  bathroom: PropTypes.node.isRequired,
  thumbnail: PropTypes.node.isRequired,
  score: PropTypes.node.isRequired,
  reviewNum: PropTypes.node.isRequired,
  price: PropTypes.node.isRequired
}
