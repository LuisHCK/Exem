Expo.io Exem SQLite Orm
===================

Expo.io SQLite/Webql Orm.

I made a very simple orm just made for getting data easier than how Expo's SQLite modules is. With hopes of getting help from other developers to make this very and useful for future developers.

> **Disclaimer**: I'm a great fan of Expo.io but there is a lot of downfalls to to. So instead of complaining i decided to help. 

### How to use:

First you have to import it (duuh?).
```
var Exem = require("exem")("data.db")
```

Now that we have Exem we can create models,  we will create a `Store` model that we will use to work with our `store` table.
```
var Store = db.table("store")
```
Not much logic goes into these for now. I hope for the future relationships could be added.

### Wait... What table?
Oh yeah we forgot to make a table. Now i made this for a simple project I was working on, so it's missing a few things. But ima just throw this in here.

```
Store.schema((table) => {
    return {
        id: table.int({primary_key: true}),
        years_active: table.int(),
        name: table.string(), // TEXT TYPE
        contact_number: table.string(),
        contact_email: table.string(),
        address: table.string(),
        created: table.datetime()
    }
}).create()
```

This will create the table if it doesn't exist.

### Querying

Here are a few examples how to query data.

#### Select
```
Store.select({name: "Payless", years_active: 10})
// SELECT * FROM store WHERE name = 'Payless' AND years_active = 10
```
```
Store.all()
// SELECT * FROM store
```

#### Search
```
Store.search({name: "less", address: "Thomas Stre"}
// SELECT * FROM store WHERE name like '%less%' OR address LIKE '%Thomas Stre%'
```

#### Update
To update you must include an id property so Exem will know which field to update, it will take the id out and use the rest of the data to update the record.
```
Store.update({id: 1, address: "#25 Jackson Lane, Konaha"}
// UPDATE store SET address = '#25 Jackson Lane, Konaha' WHERE id = 1
```

#### Delete
Delete only needs the id property to know what to delete. you can pass in other properties if you have an Object that already has the id in it, it will just ignore the rest...
```
Store.delete({id: 1, address: "#25 Jackson Lane, Konaha"}
// DELETE FROM store WHERE id = 1
```

### Results

So you know that Expo's SQLite modules uses events.... well we uses promises, why? Because it will eventually happen...

So a successful promise will return's a ResultSet object from Expo's module. You can read (a little) more about it here: https://docs.expo.io/versions/latest/sdk/sqlite.html#resultset

```
Store.select({id: 5}).then((result) => {
    let store = result.rows.item(0)
    if (store) {
        console.log("Found Store", store))
    } else {
        throw "Couldn't find store"
    }		
}).catch((error) => {
    // Expo's module may also throw an exception as well
    console.warn("Error occurred", error) 
})
```

Well there you have it. I hope this that be improved until it's like Expo's own version of Knex or something.

I want to mention I've seen drivers that we can use to use Knex and Expo's module but for what?? I feel like Expo's goal is to make things easier for us. And that's what I want this package to be...

Thank you, feel free to submit your pull requests, i'll review them as soon as I can.
