import React from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import StarIcon from '@mui/icons-material/Star'
import PropTypes from 'prop-types'

// This card is displayed at listing screen
export default function ListingShowCard (props) {
  const navigate = useNavigate()

  return (
    // listing card that users except hoster can see
    <Card sx={{ maxWidth: 345 }} onClick={e => { navigate(`/listing/${props.id}`) }}
      name='listingShowCard'
    >
      <CardHeader
        title={props.title}
      />
      {/* listing informations */}
      <Typography variant="body2" color="text.secondary">
        {props.propertyType}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Beds: {props.bedNum}  / Bathrooms: {props.bathroom}
      </Typography>
      <CardMedia
        component="img"
        height="194"
        image={props.thumbnail}
        alt={props.title}
      />
      <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
        <Typography variant="body2" color="text.secondary">
          <StarIcon fontSize="15px" />{props.score} (5.0)<br />
          {props.reviewNum} reviews<br />
          Price (per night): {props.price}
        </Typography>
      </CardContent>
    </Card>
  )
}
ListingShowCard.propTypes = {
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
