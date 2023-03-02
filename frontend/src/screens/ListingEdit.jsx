import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { styled, useTheme } from '@mui/material/styles'
import NavigationBar from '../components/NavigationBar'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import OutlinedInput from '@mui/material/OutlinedInput'
import { useNavigate, useParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import { PortNumber } from '../components/PortNumber'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

// all amenities
const names = [
  'Pool',
  'Hot tub',
  'Patio',
  'BBQ grill',
  'Fire pit',
  'Pool table',
  'Indoor fireplace',
  'Outdoor dining area',
  'Exercise equipment'
]

function getStyles (name, amenities, theme) {
  return {
    fontWeight:
      amenities.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  }
}

const BootstrapButton = styled(Button)({
  fontSize: 16,
  margin: '20px 12px'
})

function fileToDataUrl (file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const valid = validFileTypes.find(type => type === file.type)
  // Bad data, let's walk away.
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.')
  }

  const reader = new FileReader()
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result)
  })
  reader.readAsDataURL(file)
  return dataUrlPromise
}

// listing edit screen
export default function ListingEdit () {
  const navigate = useNavigate()
  const params = useParams()
  const theme = useTheme()

  const [thumbnail, setThumbnail] = useState('')
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [price, setPrice] = useState(0)
  const [propertyType, setPropertyType] = useState('Apartment')
  const [bathrooms, setBathrooms] = useState(0)
  const [bedrooms, setBedrooms] = useState([])
  const [amenities, setAmenities] = useState([])
  const [bedroomIndex, setBedroomIndex] = useState(0)
  const [propertyImages, setPropertyImages] = useState([])
  const [imageIndex, setImageIndex] = useState(0)

  useEffect(() => {
    // get listing information
    function getListing () {
      fetch(`http://127.0.0.1:${PortNumber}/listings/${params.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => {
          if (res.status === 200) {
            res.json().then(data => {
              setThumbnail(data.listing.thumbnail)
              setTitle(data.listing.title)
              setAddress(data.listing.address)
              setPrice(Number(data.listing.price))
              setPropertyType(data.listing.metadata.propertyType)
              setBathrooms(Number(data.listing.metadata.bathroom))
              setBedrooms(data.listing.metadata.bedroom)
              setBedroomIndex(data.listing.metadata.bedroom.length)
              setAmenities(data.listing.metadata.amenities)
              setPropertyImages(data.listing.metadata.propertyImages)
              setImageIndex(data.listing.metadata.propertyImages.length)
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

  // add bedroom function
  function addBedroom () {
    const bed = [...bedrooms]
    bed.push({ bedroomType: '', number: 0, index: bedroomIndex })
    setBedrooms(bed)
    setBedroomIndex(bedroomIndex + 1)
  }
  // delete bedroom function
  function deleteBedroom () {
    const bed = [...bedrooms]
    bed.pop()
    setBedrooms(bed)
    setBedroomIndex(bedroomIndex - 1)
  }
  // add property image
  function addImage () {
    const image = [...propertyImages]
    image.push({ imageUrl: '', index: imageIndex })
    setPropertyImages(image)
    setImageIndex(imageIndex + 1)
  }
  // delete property image
  function deleteImage () {
    const image = [...propertyImages]
    image.pop()
    setPropertyImages(image)
    setImageIndex(imageIndex - 1)
  }
  // function for Amenities change
  const handleAmenitiesChange = (event) => {
    const {
      target: { value },
    } = event
    setAmenities(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    )
  }
  // check if each bed number >0
  function checkBed () {
    for (const bedroom of bedrooms) {
      if (Number(bedroom.number) <= 0) {
        return false
      }
    }
    return true
  }
  // check all image have picture
  function checkImg () {
    for (const image of propertyImages) {
      if (image.imageUrl === '') {
        return false
      }
    }
    return true
  }

  // function to submit edited listing
  function submitEdit () {
    // if some input part haven't got information
    if (title === '') {
      alert('Title should not be none')
    } else if (address === '') {
      alert('Address should not be none')
    } else if (price === 0) {
      alert('Price should not be none')
    } else if (Number(price) <= 0) {
      alert('Price should more than 0')
    } else if (thumbnail === '') {
      alert('Thumbnail should not be none')
    } else if (bathrooms === 0) {
      alert('Bathroom number should not be none')
    } else if (Number(bathrooms) <= 0) {
      alert('Bathroom number should more than 0')
    } else if (checkBed() === false || bedrooms.length === 0) {
      alert('Bed number should more than 0')
    } else if (checkImg() === false) {
      alert('Property images has null')
    } else {
      // get total bed number
      let bedNum = 0
      for (const bedroom of bedrooms) {
        bedNum += Number(bedroom.number)
      }
      const postMessage = {
        title,
        address,
        price,
        thumbnail,
        metadata: {
          propertyType,
          amenities,
          bathroom: bathrooms,
          bedroom: bedrooms,
          bedTotal: bedNum,
          propertyImages
        }
      }
      fetch(`http://127.0.0.1:${PortNumber}/listings/${params.id}`, {
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
      <Typography variant="h4">Edit your listing here</Typography>
    </Grid>
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
       {/* Thumbnail */}
      <TextField sx={{ width: '40ch' }}
        InputLabelProps={{ shrink: true }}
        required
        margin="normal"
        label="Thumbnail"
        id="Thumbnail"
        type="file"

        onChange={e => fileToDataUrl(e.target.files[0])
          .then(data => setThumbnail(data))}
      />
      {/* title */}
      <TextField sx={{ width: '40ch' }}
        required
        margin="normal"
        label="Title"
        id="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      {/* address */}
      <TextField sx={{ width: '40ch' }}
        required
        margin="normal"
        label="Address"
        id="Address"
        value={address}
        onChange={e => setAddress(e.target.value)}
      />
      {/* price */}
      <TextField sx={{ width: '40ch' }}
        required
        margin="normal"
        type='number'
        label="Price (per night)"
        id="Price (per night)"
        value={price}
        onChange={e => setPrice(e.target.value)}
      />
      {/* Property Type */}
      <div>
        <FormControl sx={{ m: 1, width: '40ch' }}>
          <InputLabel id="demo-simple-select-autowidth-label" required>Property Type</InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={propertyType}
            onChange={e => setPropertyType(e.target.value)}
            autoWidth
            label="Property Type"
          >
            <MenuItem value={'Apartment'}>Apartment</MenuItem>
            <MenuItem value={'House'}>House</MenuItem>
            <MenuItem value={'Self-contained unit'}>Self-contained unit</MenuItem>
            <MenuItem value={'Unique space'}>Unique space</MenuItem>
            <MenuItem value={'Bed and breakfast'}>Bed and breakfast</MenuItem>
            <MenuItem value={'Boutique hotel'}>Boutique hotel</MenuItem>
          </Select>
        </FormControl>
      </div>
      {/* bathrooms */}
      <TextField sx={{ width: '40ch' }}
        required
        margin="normal"
        type='number'
        label="Bathroom number"
        id="Bathroom number"
        value={bathrooms}
        onChange={e => setBathrooms(e.target.value)}
      />
      {/* bedrooms type and number */}
      {bedrooms.map((bedroom) =>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          key={bedroom.index}
        >
          <TextField
            required
            margin="normal"
            label="bedroom type"
            defaultValue={bedroom.bedroomType}
            onChange={(e) => {
              bedroom.bedroomType = e.value
            }}
          />
          <TextField
            required
            margin="normal"
            label="beds number"
            type="number"
            defaultValue={Number(bedroom.number)}
            onChange={(e) => {
              bedroom.number = e.target.value
            }}
          />
        </Grid>
      )}
      {/* add/delete bedroom button */}
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Button variant="contained" onClick={addBedroom} style={{ margin: '20px' }}>
          Add Bedroom
        </Button>
        <Button variant="contained" color="error" onClick={deleteBedroom}>
          Delete Bedroom
        </Button>
      </Grid>
       {/* amenities */}
      <div>
        <FormControl sx={{ m: 1, width: '40ch', mt: 3 }}>
          <Select
            multiple
            displayEmpty
            value={amenities}
            onChange={handleAmenitiesChange}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <em>Property amenities</em>;
              }

              return selected.join(', ');
            }}
            MenuProps={MenuProps}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            {names.map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, amenities, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {/* property Images */}
      {propertyImages.map((image) =>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          key={image.index}
        >
          <TextField sx={{ width: '40ch' }}
            InputLabelProps={{ shrink: true }}
            required
            margin="normal"
            label="Property Image"
            id="Property Image"
            type="file"
            onChange={e => fileToDataUrl(e.target.files[0])
              .then(data => { image.imageUrl = data })}
          />
        </Grid>
      )}
      {/* add/delete property images button */}
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Button variant="contained" onClick={addImage} style={{ margin: '20px' }}>
          Add Property image
        </Button>
        <Button variant="contained" color="error" onClick={deleteImage}>
          Delete Property image
        </Button>
      </Grid>
      {/* submit */}
      <div>
        <BootstrapButton variant="contained"
          onClick={submitEdit}
          name="submit-btn"
        >
          Submit
        </BootstrapButton>
      </div>
    </Grid>
  </>)
}
