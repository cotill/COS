# gives us the lastest version of NodeJS
FROM node:latest

# within our image everything is in the app directory
WORKDIR /app

# copy the package.json 
COPY package.json .

# install the independices from package.json
RUN npm install

# copy of our code (i.e the src folder)
COPY . .

#build the Next JS application
RUN npm run build


CMD ["npm", "run", "dev"]

# To build the image: In terminal run, "docker build -t<<anyName you want>> ."