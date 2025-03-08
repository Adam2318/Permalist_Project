import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "adam",
  port: 5432
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy bread" },
  { id: 2, title: "Finish homework" },
];

async function getItems() {
  let items = []
  const result = await db.query("SELECT * FROM items");
  result.rows.forEach(item => {
    items.push(item);
  });
  return items;
}

app.get("/", async (req, res) => {
  items = await getItems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  const result = await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const result = await db.query("UPDATE items set title = $1 WHERE id = $2", [req.body.updatedItemTitle, req.body.updatedItemId]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const result = await db.query("DELETE FROM items WHERE id = $1", [req.body.deleteItemId]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
