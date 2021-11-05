const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("db/usernames.sqlite3", function () {
  db.run("CREATE TABLE IF NOT EXISTS twitch (username TEXT)");
});

function add(row) {
  return new Promise((res, rej) => {
    find(row)
      .then(result => {
        if (result.length > 0)
          return res(`${row} foi encontrado no banco de dados`);
        db.prepare("INSERT INTO twitch VALUES (?)")
          .run(row)
          .finalize(function (err) {
            if (err) return rej(err);
            res(`${row} foi adicionado no banco de dados`);
          });
      })
      .catch(rej);
  });
}

function del(row) {
  return new Promise((res, rej) => {
    db.prepare("DELETE from twitch WHERE username = ?")
      .run(row)
      .finalize(function (err) {
        if (err) return rej(err);
        res(`${row} foi removido do banco de dados`);
      });
  });
}

function all() {
  return new Promise((res, rej) => {
    db.all("SELECT rowid AS id, username FROM twitch", function (err, rows) {
      if (err) return rej(err);
      res(rows);
    });
  });
}

function find(query) {
  return new Promise((res, rej) => {
    db.all(
      "SELECT rowid AS id, username FROM twitch WHERE username = ?",
      query,
      function (err, rows) {
        if (err) return rej(err);
        res(rows);
      }
    );
  });
}

function findOne(query) {
  return new Promise((res, rej) => {
    db.get(
      "SELECT rowid AS id, username FROM twitch WHERE username = ?",
      query,
      function (err, row) {
        if (err) return rej(err);
        res(row);
      }
    );
  });
}

module.exports = {
  add,
  all,
  find,
  findOne,
  del
};
