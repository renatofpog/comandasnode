# Sistema de Comandas - API REST

API REST desenvolvida em **Node.js** e **Express** utilizando **SQLite** para gerenciamento de comandas de um estabelecimento (como bares, restaurantes ou lanchonetes). 

Projeto desenvolvido com foco em boas práticas de backend, segurança de dados (prevenção contra SQL Injection) e estruturação de rotas eficientes.

---

## 🚀 Tecnologias Utilizadas

* **Node.js**
* **Express**
* **SQLite** (com `sqlite` / `sqlite3`)
* **JavaScript (ES Modules)**

---

## 🗄️ Modelagem do Banco de Dados

O sistema é composto por 3 tabelas principais:
1. **`products`**: Gerencia o cardápio (produtos, preços e categorias).
2. **`orders`**: Registra as comandas abertas por mesa/cliente e seus status (`ABERTA` ou `FECHADA`).
3. **`order_items`**: Relaciona os produtos consumidos em cada comanda, registrando quantidade e preço unitário histórico.

---