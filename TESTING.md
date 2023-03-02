In Ui testing, each test should start at root screen. 

First register a user called happy path, which email is happyPath@gmail.com and password is happy_Path, register success will led user to root screen.

Second, if user want to create new listing, they need to login. After login, user can click create new listing button at hosting screen. Thumbnail is put in src/assets. If user create new listing success, it will led user to hosting screen.

Then, if user want to update a listing, they can click the modify button in listing card. They can clean the information and put new information in there. If user modify a listing success, it will led user to hosting screen.

Then, if user want to publish a listing, they can click the publish button in listing card. They can put time ranges in this screen. If user publish a listing success, it will led user to hosting screen.

Then, if user want to unpublish a listing, they can click the unpublish button in listing card. If user unpublish a listing success, the hosting screen will reload.

Then, if user want to log out, they can click the login/log out button in navigation bar. If user log out success, it will led user to login screen.

Then, if user want to login, they can click the login/log out button in navigation bar, it will led user to login screen. If user put correct email and password and submit, it will led user to root screen.