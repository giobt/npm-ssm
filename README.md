
#  Add parameter store functionality to your Dockerfile
This repository contain scripts that are used to retrieve parameters from AWS Parameter Store and export them as environment variables.

The repository has the following structure:
* **package.json**: Defines dependencies and main script for the _node.js_ app that communicates with the AWS cli to retrieve the parameters from parameter store and stores them in a text file.
* **ssm_get_secrets.js**: This script communicates with the AWS cli to retrieve the parameters from parameter store and stores them in a text file. It receives two parameters:
	1. The name of the text file where the parameters will be stored.
	2. The Parameter Store hierarchy from which it will retrieve the parameters.
* **start.sh**: Wrapper script to be added as CMD to the Dockerfile in order to retrieve the parameter store script, export the environment variables and then start the service.
## Implementation
In order to implement this feature in your docker image follow the next steps:
1. For each service, create a Dockerfile (if it isn't already created).
2. Clone the repository inside the container:
```sh
git clone git@github.com:k4connect/cloud-parameter-store.git
```
3. Modify the entrypoint to something like the following:
```sh
ENTRYPOINT [ "/bin/bash", "./cloud-parameter-store/start.sh" ]
```
4. Modify or add the CMD as follows:
```sh
CMD [ "npm", "start" ]
```
5. Verify that the image has installed **node.js**. If it doesn't, install it using the following commands:
```
RUN apt-get update -qq && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs
```
Be sure to modify the node version to fit your needs.
Now you're ready to build the image.
## Usage
In order to use this scripts, you'll need the following:
1. Environment variables:
	a. **DEPLOYMENT_ENVIRONMENT**:  For example `dev`, `staging` or `production`. This allows to manage different values for the same environment variable across environments.
	b. **SERVICE_NAME**: The name of the service that will use this variable, e.g. `sso`, `web` or `api`. This way the scripts will retrieve only the necessary variables for the service to run.
	c. **AWS_DEFAULT_REGION**: AWS region.
	d. **AWS_ACCESS_KEY_ID**: access key.
	e. **AWS_SECRET_ACCESS_KEY**: AWS secret key.
Depending on the environment you are running the service on, you can use other methods of authentication to AWS.
