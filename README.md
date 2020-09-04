# Gomigo Task
## Installation
1. Clone repository: <br/>
`git clone https://github.com/coderfool/gomigo_task.git`
2. Install dependencies: <br/>
`cd gomigo_task/listener_service` <br/>
`npm install` <br/>
`cd ../upload_service` <br/>
`npm install` <br/>
3. Start the server: <br/>
`node index`
4. Start the listener service in another terminal: <br/>
`node ../listener_service/index`
5. Access the server on `localhost:3000`
## Usage
API endpoint: `/upload` <br/>
Method: POST <br/>
Parameters: `name`, `age`, and `file`
All the parameters are saved in MongoDB, then a message is sent to the listener service using RabbitMQ. The listener service then retrieves the uploaded file from the database and stores in the local filesystem.    
