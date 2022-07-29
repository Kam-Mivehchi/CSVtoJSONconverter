# Part 1 - Processing Payments from Payroll

At VIVA Finance, one of our most valuable differentiators is the ability to receive loan repayments from our borrowers via payroll deduction. These payroll deduction payments are compiled by our transactions team into a single file containing all the payments received for the day from all borrowers. This file is sent to the engineering team as a CSV file with the following format:

_payments.csv_

| Employer  | Amount Expected | Mask       | First Name | Last Name |
| --------- | --------------- | ---------- | ---------- | --------- |
| Coca-Cola | 80.00           | \*\*12345  | Clark      | Kent      |
| Pepsi     | 58.25           | **\*\*\*** | Lex        | Luthor    |

Your task is to create a solution to parse this _payments.csv_ file and create a new output file (_applied.json_) containing an array of objects that identify how much money should be applied to each user's account. You will also identify how much they underpaid if the user did not pay their full amount. The amount to apply must be tied to a user's username, which is stored in the _db.json_ file. The _payments.csv_ file above should produce the _applied.json_ file below.

_applied.json_

```json
[
  {
    "username": "131296",
    "applied": 80,
    "owe": 0
  },
  {
    "username": "de15be",
    "applied": 58.25,
    "owe": 1.75
  }
]
```

To identify the fields in the _applied.json_ output file, use the provided _db.json_ file. The db used for the example above is shown here.

_db.json_

```json
[
  {
    "employer": "Coca-Cola",
    "mask": 12345,
    "firstName": "Clark",
    "lastName": "Kent",
    "amountExpected": 80,
    "username": "131296"
  },
  {
    "employer": "Pepsi",
    "mask": 65426,
    "firstName": "Lex",
    "lastName": "Luthor",
    "amountExpected": 60,
    "username": "de15be"
  }
]
```

## Considerations

1. In the output file _applied.json_ there should only be one payment item per user. If a user makes multiple payments in _payments.csv_, their payments should be summed in the output 'applied' field. If they only make one payment, their payment amount should be the value of the 'applied' field.
2. The output 'owe' field is the difference between the total amount received from a borrower and the amount expected for a borrower from _db.json_
3. The output 'username' field is the 'username' field in the _db.json_ object that matches the payment received in the _payments.csv_ file.
4. Determining a match between _payments.csv_ and _db.json_:
   - Employer, First Name, Last Name must be an exact match
   - if a mask exists in the row in _payments.csv_, the mask must also be an exact match
   - asterisks should be removed from the mask in _payments.csv_ when making comparisons
