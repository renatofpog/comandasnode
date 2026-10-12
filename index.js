import express from "express";
import { listProducts, registerProduct } from "./src/controllers/products.js";
import { createOrder, listOrders, addItemToOrder, closeOrder   } from "./src/controllers/orders.js";

const app = express()
const PORT = 3000

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");

  res.header(
    "Access-Control-Allow-Headers",
    "X-PINGOTHER, Content-Type, Authorization",
  );

  next();
});

app.use(express.json())


/* PRODUTOS */
app.get("/products", listProducts)
app.post("/products", registerProduct)

/* COMANDAS */
app.get("/orders", listOrders)
app.get("/orders/:id", listOrders)
app.post("/orders", createOrder)

/* ITENS DA COMANDA */
app.post("/orders/:id/items", addItemToOrder);

/* FECHAR COMANDA */
app.patch("/orders/:id/close", closeOrder);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});