const fs = require('fs');
//global variables for the object and string JSON formats
let allData = [];
let accountinfo;
let final = [];
//read the data from the db and store as array of objects
fs.readFile('db.json', 'utf8', function (err, data) {
    if (err) {
        console.error(err);
    } else {
        accountinfo = JSON.parse(data)
    }
})

//read the csv, create a json obj
fs.readFile('payments.csv', 'utf8', (err, data) => {
    if (err) {
        console.log(err);
    } else {

        let rows = data.split('\n');
        //function to create JSON and create new file
        contructJSON(rows)
    }

});
//takes in user data from payments and searches db for the username
function findUserName(first, last, emp, mask) {
    //filter user based on employer,mask, first, and last name
    let filtered = accountinfo.filter((obj) => {
        if (obj.employer == emp) {
            //if the user has a matching mask,first and last name
            if (obj.mask == mask && obj.firstName == first && obj.lastName == last) {
                return true;
            } else if (obj.firstName == first && obj.lastName == last) {
                //if the user doesnt match one of the above criteria(likely mask)then check if first and last names match
                return true
            }

        }
        return false

    }
    )
    //return the username from the filtered array
    return filtered[0].username
}
//helper function that takes in a userName and searches the accountinfo variable for an object that matches the user name and returns how much is expected
function getDues(userName) {
    let filtered = accountinfo.filter((obj) => obj.username == userName);

    return filtered[0].amountExpected
}

//builds a JSON object then writes a JSON file
function contructJSON(arr) {
    //object for tracking multiple payments
    let seen = {}
    let currIndex = 0;

    //starting at index 1 (ignore headers)
    for (let i = 1; i < arr.length; i++) {

        //split each row at the commas
        let transactionArray = arr[i].split(',')

        //create an template object containing all the data from payments.csv 
        let obj = {
            "employer": transactionArray[0],
            "mask": transactionArray[2],
            "firstName": transactionArray[3],
            "lastName": transactionArray[4],
            "applied": parseInt(transactionArray[1]),
        }

        //find employee username
        let username = findUserName(obj.firstName, obj.lastName, obj.employer, obj.mask)


        //create template object for the final JSON array
        let result = {
            "username": username,
            "applied": parseInt(transactionArray[1]),
            "owe": getDues(username) - obj.applied
        }

        //if the username is not been added to our final array
        if (!seen[username]) {
            //add it to the seen array with a value of the index in the final array, increment the curr index,push the object to all data array and to the final JSON
            seen[username] = currIndex;
            currIndex++
            allData.push(obj)
            final.push(result)
        } else {
            //otherwise add the payment amount to the result.applied value and subtract from amount owed
            let idx = seen[username];
            final[idx].applied += result.applied
            final[idx].owe -= result.applied
        }
    }

    //once the final JSON array has been contructed write the finle to "applied.JSON"
    fs.writeFile('applied.json', JSON.stringify(final), 'utf-8', err => {
        if (err) {
            console.log(err)
        }
    })
}
