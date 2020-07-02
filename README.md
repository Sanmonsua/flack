# FLACK - CS50W Project 2

In this project, I built an online messaging service using Flask, similar in spirit to Slack. Users are be able to sign into your site with a display name, create channels (i.e. chatrooms) to communicate in, as well as see and join existing channels. Once a channel is selected, users will be able to send and receive messages with one another in real time.

![image](https://user-images.githubusercontent.com/38411225/86301994-01234580-bbcd-11ea-8563-2cbf351cd7e5.png)

## app.py

This file is our flask app. It manages the different routes of the application, some global variables to save the different chat rooms data as creator, name and messages in the server side. Also, it is important to say that this file includes the web socket for a real time chat.

## templates

- signin.html : Template to signin to the application.
- index.html : Main template. Includes the channel list and the chat.

## static files

- index.js : This file manages the client side of our application. It pulls data likewise channels and chat messages from the server, emits and receives web sockets events to dynamicly modify the data to the user.
- master.css : add styling to the app.
