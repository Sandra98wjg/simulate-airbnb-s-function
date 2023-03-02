
describe('user happy path', () => {
  beforeEach(() => {
    cy.visit('localhost:3000/')
  })
  it('should registers successfully', () => {
    cy.get('button[name="login-out-btn"]').click()
    cy.url().should('include','localhost:3000/login')
    // login screen to register screen
    cy.get('button[name="to-register-btn"]').click()
    cy.url().should('include','localhost:3000/register')
    // register a user
    const email = 'happyPath@gmail.com'
    const name = 'happy path'
    const password = 'happy_Path'
    cy.get('input[id="Email"]').focus().type(email)
    cy.get('input[id="Name"]').focus().type(name)
    cy.get('input[id="Password"]').focus().type(password)
    cy.get('input[id="Password2"]').focus().type(password)
    cy.get('button[name="submit-btn"]').click()
    cy.url().should('include','localhost:3000')
  })

  it('should creates a new listing successfully', () => {
    // only login user can go to hosting screen
    cy.get('button[name="host-btn"]').click()
    const email = 'happyPath@gmail.com'
    const password = 'happy_Path'
    cy.get('input[id="Email"]').focus().type(email)
    cy.get('input[id="Password"]').focus().type(password)
    cy.get('button[name="submit-btn"]').click()
    cy.wait(1000)
    // hosting screen
    cy.get('button[name="host-btn"]').click()
    cy.url().should('include', 'localhost:3000/hosting')
    // listing create screen
    cy.get('button[name="create-new-listing-btn"]').click()
    cy.url().should('include', 'localhost:3000/listingcreate')
    // create listing
    const thumbnail = 'src/assets/UiTest.jpg'
    const title = 'Happy Path Listing'
    const address = 'Sydney NSW'
    const price = 450
    const bathroomNumber = 2
    const bedroomType = 'Common space'
    const bedNumber = 2
    cy.get('input[id="Thumbnail"]').selectFile(thumbnail)
    cy.get('input[id="Title"]').focus().type(title)
    cy.get('input[id="Address"]').focus().type(address)
    cy.get('input[id="Price (per night)"]').focus().type(price)
    cy.get('input[id="Bathroom number"]').focus().type(bathroomNumber)
    cy.get('button[name="add-bedroom-btn"]').click()
    cy.get('input[name="bedroom type"]').focus().type(bedroomType)
    cy.get('input[name="beds number"]').focus().type(bedNumber)
    cy.get('button[name="submit-btn"]').click()
    cy.wait(1000)
    cy.url().should('include','localhost:3000/hosting')
  })
  it('should updates the thumbnail and title of the listing successfully', () => {
    // only login user can go to hosting screen
    cy.get('button[name="host-btn"]').click()
    const email = 'happyPath@gmail.com'
    const password = 'happy_Path'
    cy.get('input[id="Email"]').focus().type(email)
    cy.get('input[id="Password"]').focus().type(password)
    cy.get('button[name="submit-btn"]').click()
    cy.wait(1000)
    // hosting screen
    cy.get('button[name="host-btn"]').click()
    cy.url().should('include', 'localhost:3000/hosting')
    // edit screen
    cy.get('button[aria-label="edit"]').click()
    cy.url().should('include', 'localhost:3000/listingedit/')
    cy.wait(1000)
    // edit title and thumbnail
    const newTitle = 'New Happy Path Listing'
    const newThumbnail = 'src/assets/UiTestNew.jpg'
    cy.get('input[id="Title"]').focus().clear()
    cy.get('input[id="Title"]').focus().type(newTitle)
    cy.get('input[id="Thumbnail"]').selectFile(newThumbnail)
    cy.get('button[name="submit-btn"]').click()
    cy.wait(1000)
    cy.url().should('include','localhost:3000/hosting')
  })

  it('should publish a listing successfully', () => {
    // only login user can go to hosting screen
    cy.get('button[name="host-btn"]').click()
    const email = 'happyPath@gmail.com'
    const password = 'happy_Path'
    cy.get('input[id="Email"]').focus().type(email)
    cy.get('input[id="Password"]').focus().type(password)
    cy.get('button[name="submit-btn"]').click()
    cy.wait(1000)
    // hosting screen
    cy.get('button[name="host-btn"]').click()
    cy.url().should('include', 'localhost:3000/hosting')
    cy.get('button[aria-label="golive"]').click()
    cy.url().should('include', 'localhost:3000/listingpublish/')
    // publish screen
    const start = '11/01/2022'
    const end = '11/30/2022'
    cy.get('button[name="add-time-btn"]').click()
    cy.get('input[name="start-time"]').focus().type(start)
    cy.get('input[name="end-time"]').focus().type(end)
    cy.get('button[name="submit-btn"]').click()
    cy.wait(1000)
    cy.url().should('include','localhost:3000/hosting')
  })

  it('should unpublish a listing successfully', () => {
    // only login user can go to hosting screen
    cy.get('button[name="host-btn"]').click()
    const email = 'happyPath@gmail.com'
    const password = 'happy_Path'
    cy.get('input[id="Email"]').focus().type(email)
    cy.get('input[id="Password"]').focus().type(password)
    cy.get('button[name="submit-btn"]').click()
    cy.wait(1000)
    // hosting screen
    cy.get('button[name="host-btn"]').click()
    cy.url().should('include', 'localhost:3000/hosting')
    // unpublish button
    cy.get('button[aria-label="unpublish"]').click()
    cy.url().should('include','localhost:3000/hosting')
  })

  it('should logs out of the application successfully', () => {
    cy.get('button[name="login-out-btn"]').click()
    cy.url().should('include','localhost:3000/login')
  })

  it('should logs back into the application successfully', () => {
    cy.get('button[name="login-out-btn"]').click()
    const email = 'happyPath@gmail.com'
    const password = 'happy_Path'
    cy.get('input[id="Email"]').focus().type(email)
    cy.get('input[id="Password"]').focus().type(password)
    cy.get('button[name="submit-btn"]').click()
    cy.url().should('include','localhost:3000')
  })
})
