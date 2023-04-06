<h1 align="center"> Ecocentives </h1> 
<div align="center">
  <a align="center" href="https://github.com/gdcho/1800_202310_BBY10">
    <img src="https://github.com/gdcho/1800_202310_BBY10/blob/main/public/img/logo.png" alt="Logo" width="80" height="80">
  </a>
</div>

## Project Description
A web-based application to encourage Canadians to practice environmentally-friendly habits with an incentive program, allowing users to complete recurring tasks while competing with one another to collect points for reward redemption.
<br>
<img align="center" src="https://github.com/gdcho/1800_202310_BBY10/blob/main/public/img/ecoincentives.png" alt="Landing" width="1000">

## Contributors
| <img src="https://github.com/gdcho/1800_202310_BBY10/blob/main/public/img/david-memoji.png" alt="David" width="70"> | <img src="https://github.com/gdcho/1800_202310_BBY10/blob/main/public/img/gin-memoji.png" alt="Gin" width="70"> | <img src="https://github.com/gdcho/1800_202310_BBY10/blob/main/public/img/sohee-memoji.png" alt="Sohee" width="70"> |
| :---: | :---: | :---: |
| David Cho | Gin Lu | Sohee Hwang |
*Hi, my name is David. I like the environment.* | *Hi, my name is Gin. I am looking forward to the outcome of this project.* | *Hi, my name is Sohee. This project is interesting.*
	
## Technologies and Resources Used
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

## Complete setup/installion/usage

Installation:
* Download this entire project folder and navigate to the root folder using Command Prompt or Terminal.
```sh
git clone https://github.com/gdcho/1800_202310_BBY10
```
* Install node.js by running this in Command Prompt or Terminal 
```sh
npm install -g npm
```
* Check to make sure node was installed successfully
```sh
node -v
```
* Check to make sure npm was installed successfully
```sh
npm -v
```
* Navigate to the root folder for this app and run this in Command Prompt or Terminal
```sh
node node.js
```
* Open a web browser and type this in the address bar
```sh
localhost:8000 or 127.0.0.1:8000
```

Instructions:
* Create an account or login with your existing credentials.
* Update profile information on profile page.
* Browse through the tasks list and select tasks to complete.
* Upload proof of completion for each task to earn points.
* Browse through the rewards and select a reward to redeem.

## Known Bugs and Limitations
Here are some known bugs:
* Task completion loophole by uploading an image with keyword.
* ...

## Features for Future
What we'd like to build in the future:
* Communities and forums for users to share their eco-actions for the day.
* Implementing OpenAI 4.0 API for task image recognition.
	
## Contents of Folder
Content of the project folder:

```
 Top level of project folder:

/1800_202310_BBY10
├── app                             # Firebase and HTML files
├── public                          # CSS, JS, and img files
├── text                            # Navbar and footer files
├── .gitignore                      # Git ignore file
├── README.md                       # Project description
├── node.js                         # Serves the website on Port 8000
├── package-lock.json               # JSON files
└── package.json                    # JSON files

It has the following subfolders and files:
├── app/                            # Firebase and HTML files
│   ├── firebase                    # Firebase initialization
│   └── html                        # HTML files
│
├── public/                         # CSS, JS, and img files
│   ├── css                         # CSS files
│   ├── img                         # img files
│   └── js                          # JS files
│
└── text/                           # HTML files for footer and nav
    ├── footer.html                 # footer for web
    ├── footer_after_login.html     # footer for web after login
    ├── nav_after_login.html        # navigation after login
    ├── nav_before_login.html       # navigation before login
    └── nav_mobile.html             # footer for mobile after login
```


