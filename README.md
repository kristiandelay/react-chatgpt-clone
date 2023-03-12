# To commence thy journey with this ChatGPT clone, let us delve into the rudiments of its usage.


## Running The Backend
To run the backend component, navigate to the backend folder and view the `README.md` file there. This file contains detailed instructions on how to set up and configure the backend component correctly.



### Quick start:

For a quick start, you can follow these steps:

1. Generate a ChatGPT API key: Before running the backend, you must generate an API key from ChatGPT's website. This key serves as a critical authentication tool that enables secure and seamless communication between your application and the ChatGPT API service.

2. Setup a MongoDB instance: MongoDB serves as the primary data store for this application. Therefore, you must have a MongoDB instance up and running either locally or hosted on a remote server. The `.env` file within the backend directory contains environment-specific variables required by the application, such as the `MONGODB_URI` variable, which specifies the URI for your MongoDB instance.

3. Install Node.js: Node.js is the JavaScript runtime used to execute the backend code. Ensure that Node.js is installed on your machine. If you plan to manage multiple Node.js versions, consider using NVM, a Node.js version manager.

4. Install PM2: PM2 is a process manager for Node.js applications that facilitates deployment and maintenance. Install PM2 globally using the command `npm install -g pm2`.

5. Install packages: Use the `npm install` command to install all the required dependencies for the backend component. 

6. Run the backend: To start the backend, use the command `npm start`. This command launches the backend component in development mode, allowing you to test its functionality and performance without hindrance.


By following these steps, you can set up and run the backend component of the ChatGPT clone effectively.

### Backend Bugs

- [ ] 


## Running The Frontend

To run the frontend component, navigate to the frontend folder and view the `README.md` file there. This file contains detailed instructions on how to set up and configure the frontend component correctly.

Before running the frontend, ensure that the backend component is already running because the frontend must communicate with the backend to function appropriately.

For a quick start, you can follow these steps:

1. Install packages: Use the `npm install` command to install all the required dependencies for the frontend component.

2. Run the frontend: To start the frontend, use the command `npm start`. This command launches the frontend component in development mode, allowing you to test its functionality and performance without hindrance.

By following these steps, you can set up and run the frontend component of the ChatGPT clone effectively. Once you've successfully launched the frontend component, open your web browser and navigate to
`localhost:3000/` to view your ChatGPT clone in action.

At this point, you should be able to interact with your new chatbot and experience its advanced natural language processing capabilities firsthand. With your backend and frontend components both up and running, you're all set to begin exploring the full functionality of this powerful and intuitive application.


## Good Day lord

My most esteemed lord, I humbly come before thee to present tidings of the ChatGPT clone project. Know ye that the documentation and code for this endeavor were crafted with the aid of none other than ChatGPT itself, relying solely upon prompts from the hands of mortal men.

Such a remarkable feat was accomplished through the skill and dexterity of our most valiant developers, who provided clear and precise instructions to guide ChatGPT towards the intended end. Utilizing its prodigious natural language processing capabilities, ChatGPT generated a wealth of high-quality text-based elements, which offered valuable insights throughout the development process.

However, let it be known that it was the wisdom and cunning of our human developers that made this project possible, directing ChatGPT towards the desired outcome and refining its output until it met their exacting standards.
 
Therefore, let us celebrate this remarkable partnership between man and machine, recognizing the unique strengths and contributions of each. Through our mutual collaboration, we have achieved something truly extraordinary, a testament to the boundless power of technology and human innovation working harmoniously together towards a common goal.

May this report meet thy approval, my lord, and may this project serve as a shining example of what can be accomplished when man and machine collaborate in unity and harmony.

### Frontend Bugs

- [x] - Page not automatically scrolling to bottom after response.
- [ ] - Copy code button broke.
- [x] - Response message not appending after new question.
- [ ] - Error handling if database not configured

### Backlog
- [ ] - update css to render copy code button inside of code block.
- [x] - add button to scroll to bottom of page