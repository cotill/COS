# gives us the lastest version of NodeJS
FROM node:latest

# within our image everything is in the app directory
WORKDIR /frontend/app

# copy the package.json 
COPY /frontend/package.json .
COPY /frontend/package-lock.json .

# install the independices from package.json
RUN npm ci

# copy of our code (i.e the src folder)
COPY /frontend .

#build the Next JS application
RUN npm run build


CMD ["npm", "run", "dev"]

# To build the image: In terminal run, "docker build -t<<anyName you want>> ."