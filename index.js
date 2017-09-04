var Promise = require("bluebird")
var SQLite = require("expo").SQLite

var Exem = (sqlite_file) => {
    let db = SQLite.openDatabase(sqlite_file);
    return new Database(db)
}

class Database {
    constructor(db) {
        this.db = db
    }
    table(name) {
        return new Table(this.db, name)
    }
    
    exec(query, params) {
        return new Table(this.db, null, null).execute_sql(query, params)
    }
}

class Table {
    constructor(db, name) {
        this.db = db
        this.name = name
    }

    schema(table_schema) {
        let schema = table_schema(new TableValueTypes())
        let columns = Object.entries(schema).map((c) => { return c[1].replace("{column}", c[0]) }).join(", ")
        let create_table_query = "create table if not exists " + this.name  +" (" + columns + ");"
        return {
            "create": this.execute_sql.bind(this, create_table_query),
            "schema": create_table_query
        }
    }

    // create table if not exists items (id integer primary key not null, done int, value text);

    execute_sql(query, params) {
        params = params || []
        exec = (resolve, reject) => {
            let resolve_func = (tx, results) => { return resolve(results) }
            let reject_func = (tx, results) => { return reject(results) }
            this.db.transaction(tx => {
                tx.executeSql(query, params, resolve_func, reject_func)
            })
        }
        return new Promise(exec.bind(this));
    }

    select(params) {
        let where_clause = Object.entries(params).map((d) => { 
            let column = d[0]
            return column + " = ?"
        }).join(" AND ")

        let values = Object.values(params)

        let query = "select * from " + this.name + " where " + where_clause + ";"

        return this.execute_sql(query, values)
    }

    search(params) {
        let where_clause = Object.entries(params).map((d) => { 
            let column = d[0]
            return column + " like ?"
        }).join(" OR ")

        let values = Object.values(params).map((val) => { return "%" + val + "%" })

        let query = "select * from " + this.name + " where " + where_clause + ";"
        return this.execute_sql(query, values)
    }

    all() {
        let query = "select * from " + this.name + ";"
        return this.execute_sql(query, [])
    }

    insert(params) {
        var columns = Object.keys(params).join(", ")
        var values = Object.values(params)
        var values_placeholders = Object.values(params).map(c => { return "?" }).join(", ")
        let query = "insert into " + this.name + " (" + columns +")  values (" + values_placeholders + ");"
        return this.execute_sql(query, values)
    }

    update(params) {
        // get id
        if (!params.id)
            throw "PropertyError: `id` required to perfrom update"
        let table_id = params.id
        delete params.id

        let set_clause = Object.entries(params).map((d) => { 
            let column = d[0]
            return column + " = ?"
        }).join(", ")
        var values = Object.values(params)
        values.push(table_id)
        
        let query = "update " + this.name + " set " + set_clause + " where id = ?;"
        return this.execute_sql(query, values)
    }

    delete(params) {
        // get id
        if (!params.id)
            throw "PropertyError: `id` required to perfrom update"
        let table_id = params.id
        let query = "delete from " + this.name + " where id = ?;"
        return this.execute_sql(query, [table_id])
    }
}

class TableValueTypes {

    string() {
        return "{column} text"
    }

    datetime() {
        return "{column} datetime"
    }

    int(data) {
        data = {auto_increment: false, primary_key: false, ...data}
        return "{column} integer {primary_key}"
        .replace("{length}", data.length)
        .replace("{primary_key}", data.primary_key ? "primary key" : "")
    }
}

module.exports = Exem
