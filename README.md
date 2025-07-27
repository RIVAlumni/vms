# Visitor Management System
This is intended to be a basic Visitor Management System (VMS) implemented in Uvicorn with the following features:

Backend: 
- store NRIC (PK), full name, phone number, datetime, operatorname in a sqlite db. 
	- NRIC format is \w\d{7}\w
	- phone number is \d{8}
	- datetime is iso8601
	- fullname max 66 characters
	- operatorname max 66 characters
- if NRIC exists in the database, return FAIL with the details to the frontend. otherwise return a OK status. 

Frontend: 
1. Default Page - QR Generator
- Enter details and get the QR
2. Login
	- login: key in operator's name - show in the top right of interface and send to server
3. Submit
	- allows for manual input through a form: full name, NRIC, phone number
	- allows for a encoded input from QR code and populate it into the form. The QR scanner will output in |NRIC|HP|NAME| - submit the form and display the status
4. Query
	 - show table contents, with filtering and sorting by any of the 5 columns
5. Watermarking with username and datetime of login (name YYYYMMDD HHMMSS)

Uses:
1. Bootstrap CSS
2. QRCode.JS to create the QR code (static/qrgen.html)
3. FastAPI + Uvicorn backend

To get started:
```sh
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```