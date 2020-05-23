## SSIN Project

To install needed dependencies run:  
``npm install``  
To start the project's three servers run:  
``npm start``

These are the following implemented Users and their respective scopes:
 
    username: "SSIN-all",
    read: true,
    write: true,
    delete: true,
  
  
    username: "SSIN-read",
    read: true,
    write: false,
    delete: false,
  
    username: "SSIN-write",
    read: false,
    write: true,
    delete: false,
  
    username: "SSIN-delete",
    read: false,
    write: false,
    delete: true,
 
    username: "SSIN",
    read: true,
    write: true,
    delete: true,
 
The password of the resource owner is:  
``SSIN``