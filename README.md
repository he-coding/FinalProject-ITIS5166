# ITCS 5166 Food Trade Project

### Name: He Zhao

This repository contains the source code for the Food Trade web application, developed by He Zhao. The application serves as a platform for users to discover, engage in food-related trades, or share food. This milestone covers the integration of user authentication, authorization, and session management, as well as improvements to error handling, flash messages, and dynamic features.

## Features And Updates For Final Milestone 
Implement Trade Offer Feature
1. Updated the Trade and User models to support trade offers and watchlist functionality. This includes establishing relationships between users, items, and trade offers.
2. Created new view templates for the trade offer creation, trade offer management, and user watchlist display.
3. Implemented controller functions to handle trade offer creation, cancellation, acceptance, and rejection, as well as managing the user's watchlist.
4. Set up routes for trade offer and watchlist-related requests.
5. Ensured proper handling of user authentication and authorization for trade and offer actions. This includes redirecting unauthenticated users to the login page and restricting authenticated users to trading their own items and making offers for others' items.
6. Implemented dynamic display of trade offer statuses and action buttons on the trade detail page. This includes showing update/delete buttons for trade owners and offer/trade buttons for other users.
7. Updated the user profile page to display a table of the user's trades with their status, offers made, and items added to their watchlist.
8. Decided on a strategy for handling delete actions in the case of associated users and items. Options include cascading the delete action or setting related fields to null and handling this case in the application logic.

9. Input Validation and Sanitization
In our application, I perform input validation and sanitization to ensure that user inputs are safe and meet the necessary requirements before they are stored in the database. This is essential to maintain data integrity and protect the application from potential security risks like XSS attacks. My input validation process guarantees the following requirements:
1. Escaping inputs: All user inputs, except for passwords, are escaped to avoid Cross-Site Scripting (XSS) attacks. This helps ensure that any potentially harmful characters are neutralized before they reach the database or get displayed on the user interface.
2. Trimming fields: All input fields are trimmed to remove any extra spaces. This helps maintain consistency in the data and prevents unintended errors due to additional whitespace.
3. Validating email fields: All email fields are checked to ensure they contain a valid email format. This helps maintain data consistency and ensure that only properly formatted email addresses are stored in the database.
4. Normalizing email fields: All email fields are normalized by converting them to lowercase and removing any unnecessary characters. This process helps maintain data consistency and makes it easier to perform case-insensitive searches and comparisons.
5. Password length: The password field must have a minimum length of 8 and a maximum length of 64 characters. This ensures that passwords are strong enough to provide a reasonable level of security while also preventing excessively long passwords that could cause performance issues.
6. Required fields: If a field is marked as required in the database schema, the field cannot be empty during input validation. This helps ensure that all necessary data is provided by the user before it's stored in the database.

## Features And Updates For Milestone 4

1. User authentication: Users can sign up and log in to access their account and manage their trades.
2. User authorization: Different levels of access and functionalities are provided based on the user's role.
3. User profile: Users can view and edit their profile information, as well as see a table of trades created by them.
4. Session management: Persistent session storage is implemented to maintain user sessions even when the server restarts.
5. Error handling: The application handles various errors such as sign-up errors, unauthorized requests, failed authentication, and Mongoose validation errors.
6. Flash messages: Success and error notifications are displayed to users using flash messages.
7. Dynamic features: The application supports dynamic navigation based on user roles and shows update and delete buttons only to trade owners.

#### Technologies

The following technologies were used in the development of this milestone:

- Node.js
- Express.js
- MongoDB
- Mongoose
- Bcrypt
- EJS (Embedded JavaScript templates)
- CSS
- Passport (User authentication)
- Express-session (Session management)
- Connect-mongo (Persistent session storage)
- Connect-flash (Flash messages)

#### Installation and Usage

To run this application on your local machine, follow these steps:

1. Clone the repository.
2. Install the required dependencies by running `npm install`.
3. Set up the environment variables for the database connection in a `.env` file.
4. Run the application using `npm start` or `node app.js`.
5. Access the application through a web browser at `http://localhost:3000`.

#### Updates

Throughout the chat session, we have worked on the following aspects:

1. Integrated user authentication and authorization with Passport.
2. Implemented session management using express-session and connect-mongo.
3. Associated users and trades by updating the trade model, trade controller, and view templates.
4. Added error handling and flash messages to improve user experience.
5. Implemented dynamic features such as dynamic navigation and update/delete button display based on user roles.

#### Database Exports

The application includes at least two user accounts and several trades, with a minimum of two categories/topics and at least three trades per category/topic. The MongoDB collections for users and trades are exported as JSON files.

## Features And Updates For Milestone 3

Made the following updates based on my finished milestone Two:

1. Configured MongoDB database
   Developed a model and a schema for trades in my application.
   The following fields are included in each trade document:

- _id
- item name
- item topic
- details
  All of the fields in my schema use the necessary validator, and my schema includes rules for field validation.

2. Establishing and populating databases
   Created a database script with all the MongoDB queries in it. It is kept beneath the main branch.
3. Implemented a connection to the MongoDB database in app.js.
4. The application now stores and reads data from the MongoDB database due to an update to the controller module.
5. Implemented input validation on the front end for the following EJS view templates:

- The new trade template
- The edit trade template

6. Handling errors
   I added logic to my controller function to deal with the following errors:

- Send a 400 error to the user if a request contains an invalid route parameter, such as the URL's id not being a valid ObjectId type value
- If a request is made to insert or update a document in the database and mongoose validation fails
- Send a 400 error to the user if a request contains an invalid route parameter, such as the URL's id not being a valid ObjectId type value
- If a request is made to insert or update a document in the database and mongoose validation fails

### Description of the RESTful routes for requests associated with trading items

Route names and patterns associated with trading items in my Web APP :

1. **GET** `/trades` - Index route: Retrieves and displays a list of all trading items, grouped by categories.
2. **GET** `/trades/new` - New route: Displays a form to create a new trading item.
3. **POST** `/trades` - Create route: Processes the form data from the New route and creates a new trading item in the database.
4. **GET** `/trades/:id` - Show route: Retrieves and displays the details of a specific trading item identified by its ID.
5. **GET** `/trades/:id/edit` - Edit route: Displays a form to edit an existing trading item.
6. **PUT** `/trades/:id` - Update route: Processes the form data from the Edit route and updates the trading item in the database.
7. **DELETE** `/trades/:id` - Delete route: Deletes a specific trading item identified by its ID from the database.

These routes correspond to the functions i have implemented in my `itemController.js`.


The routes are defined in two separate route files: `mainRoutes` and `itemRoutes`.

In my `app.js`, I have mounted these route files to the regarding paths:

1. `app.use('/', mainRoutes);` - This line mounts the `mainRoutes` to the root path (`/`). The routes defined in `mainRoutes` file will handle the requests for the root and other non-item related routes.
2. `app.use('/trades', itemRoutes);` - This line mounts the `itemRoutes` to the `/trades` path. The routes defined in `itemRoutes` file will handle the requests associated with trading items, as described in the previous response.


`mainRoutes.js`:

1. Home - GET `/`
2. About - GET `/about`
3. Contact - GET `/contact`

`itemRoutes.js` (with `/trades` prefix from app.js):

1. Index - GET `/trades/`
2. New Trade - GET `/trades/newTrade`
3. Create Trade - POST `/trades/`
4. Show Trade - GET `/trades/:id`
5. Edit Trade - GET `/trades/:id/edit`
6. Update Trade - PUT `/trades/:id`
7. Delete Trade - DELETE `/trades/:id`

These are the route names and patterns for your application. The `itemRoutes.js` file contains the RESTful routes for requests associated with trading items, while the `mainRoutes.js` file contains routes for the home, about, and contact pages.



## Features And Updates For Milestone 2

I built an updated version of my Food Trade application utilizing the MVC design pattern to create an Express online application. This update was based on my first Milestone. In order to display the view in the browser, I utilized EJS. I was able to successfully direct the request to the correct controller function by utilizing modularized routes. For the purpose of controlling the flow of the application, I made use of a modularized controller.



*Regarding images, they are all sourced from the free photo sharing website unsplash.com. Any of the photographs you find on Unsplash can be used in your business or personal projects without asking for permission.*

## Features And Updates For Milestone 1

**Using these criteria, I built four HTML pages for Milestone One:**

- For my ITCS 5166 class, I chose and, with a lot of imagination, made up my own Food Trade topic/domain to work on during the entire project.

- Each of my completed pages is an own HTML file.  Yet, they all share a similar style in an effort to maintain the site's uniformity. This means that some design components will be used more than once on different pages.

- Elements of design that are shared across pages must render identically in order to ensure a fluid and user-friendly user experience. It has a clean design that makes it easy to find what audiences looking for.

- I've completed all of the material for Milestone One and have it fully functional in HTML standards.



**For my milestone one, In total, there are four primary implementations available in the repository:**

- index.html : main page of the application
- trades.html: the listing page
- trade.html: the individual item page
- newTrade.html: adding new item page

## Author

He Zhao - UNC Charlotte Computer Science Master's student
