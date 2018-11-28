

# Dashboard Backend
## Product Description
This module powers dashboard frontend for advertiser and publishers. It consist of following modules

* **Chymera User** - API for generic chymera user
	* Registration, login and access control
	* Payments and payouts
	* Test devices for testing VR ads
* **Advertiser**
	* Managing campaigns, adgroups and ads
	* Targeting module
	* Bidding and budgeting
	* Analytics dashboard to understand ad performance
* **Publisher**
	* Managing apps and ad placements
	* Managing earnings
## Technologies used
* Backend framework - Django rest framework
* Database - PostgreSQL
* Cloud - Azure server and storage
* Deployment - Docker
* API testing - Postman
## Getting started
* Install docker 
	`bash install_docker.sh	`
* From project root, build docker image
	`sudo docker build -t dashboard . `
* Starting docker container
	* For dev purpose
		* Start container with DEBUG='True'
		`sudo docker run -d --net=host --name dashboard-container -e DEBUG='True' dashboard`
		* Log into docker terminal
		`sudo docker exec -i -t dashboard-container /bin/bash`
		* Initialise dev database
		* `bash devbootstrap.sh`
	* For product purpose
		* Start container without DEBUG='True'
		`sudo docker run -d --net=host --name dashboard-container -e dashboard`
* Now server is live at :8000 port
* Access admin < domain >:8000/admin
* For testing, access test APIs through postman using collection https://www.getpostman.com/collections/d468561862a4da8c770d
		
## License
This project is licensed under the MIT License

## Authors
* Rubbal Sidhu
* Sushil Kumar - [Github](https://github.com/sushilmiitb)

