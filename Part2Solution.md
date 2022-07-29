# Part 2 - Database Design



##  Data Schema

db.json
| Key            | Value               |
| -------------- | ------------------- |
| UserName       | Primary_Key, String |
| Employer       | Foreign_Key, String |
| Mask           | Foreign_Key, String |
| firstName      | String              |
| lastName       | String              |
| amountExpected | INT                 |
| Payments       | String              |
| Owe            | String              |



## Logic Explanation

For this database, I would store the username as a primary key due to it being unqiue regardless of employer. Then I would use foreign keys to store employees and their masks in relation to their employer. Doing so would allow direct lookups with the the information given in the CSV file. This would greatly reduce the time complexity of the original solution.

 In the original solution the username was determined by filtering the db for each payment item, resulting in O(N*P) time complexity for this function, where N represents the length of the dbArray and P represents the # of payments that were proccessed. 

 With a database that uses foreign keys to establish relationships between the users username,name, mask and employer. The username can be directly looked up in the employer table with either a mask or first/last name. This changes the time complexity to 0(P), where P represents the # of payments that were proccessed. This because we do not have to filter/loop the db array to access a username.

