import { openDatabase } from "../database.js";

export const listOrders = async (request, response) => {
  let db;
  try {
    const { id } = request.params;

    db = await openDatabase();

    let results;

    if (id) {
      results = await db.get(`SELECT * FROM orders WHERE id_order = ?`, [id]);

      if (!results) {
        return response
          .status(404)
          .json({ message: "Comanda não encontrada." });
      }

      return response.status(200).json(results);
    }

    results = await db.all(`SELECT * FROM orders`);

    return response.status(200).json(results);
  } catch (error) {
    console.error("Erro ao listar pedidos", error);
    return response.status(500).json({ message: "Erro ao listar pedidos." });
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeError) {
        console.error("Erro ao fechar o banco no finally:", closeError);
      }
    }
  }
};

export const createOrder = async (request, response) => {
  let db;
  try {
    const { table_number, customer_name } = request.body;

    if (!table_number || !customer_name) {
      return response
        .status(400)
        .json({ message: "Todos os campos são obrigatórios." });
    }

    db = await openDatabase();

    const data = await db.run(
      `INSERT INTO orders (table_number, customer_name) VALUES (?, ?)`,
      [table_number, customer_name],
    );

    await db.close();
    return response.status(201).json({
      id: data.lastID,
      table_number,
      customer_name,
    });
  } catch (error) {
    if (db) {
      try {
        await db.close();
      } catch (closeError) {
        console.error("Erro ao fechar o banco no catch:", closeError);
      }
    }

    console.error("Erro na rota createOrder:", error);

    return response.status(500).json({
      message: "Não foi possível cadastrar o seu pedido!",
    });
  }
};

export const addItemToOrder = async (request, response) => {
  let db;
  try {
    const { id } = request.params; // ID da comanda
    const { product_id, quantity } = request.body;

    if (!product_id || !quantity) {
      return response.status(400).json({ message: "Informe o produto e a quantidade." });
    }

    db = await openDatabase();

    const order = await db.get(`SELECT * FROM orders WHERE id_order = ?`, [id]);
    if (!order) {
      return response.status(404).json({ message: "Comanda não encontrada." });
    }
    if (order.status_order === 'FECHADA') {
      return response.status(400).json({ message: "Esta comanda já está fechada e não aceita novos itens." });
    }

    const product = await db.get(`SELECT * FROM products WHERE id_product = ?`, [product_id]);
    if (!product) {
      return response.status(404).json({ message: "Produto não encontrado no cardápio." });
    }

    const data = await db.run(
      `INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)`,
      [id, product_id, quantity, product.price_product]
    );

    return response.status(201).json({
      id_item: data.lastID,
      order_id: id,
      product_name: product.name_product,
      quantity,
      unit_price: product.price_product,
      subtotal: quantity * product.price_product
    });
  } catch (error) {
    console.error("Erro ao adicionar item na comanda:", error);
    return response.status(500).json({ message: "Não foi possível adicionar o item." });
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeError) {
        console.error("Erro ao fechar o banco no finally:", closeError);
      }
    }
  }
};

export const closeOrder = async (request, response) => {
  let db;
  try {
    const { id } = request.params;

    db = await openDatabase();

    const order = await db.get(`SELECT * FROM orders WHERE id_order = ?`, [id]);
    if (!order) {
      return response.status(404).json({ message: "Comanda não encontrada." });
    }
    if (order.status_order === 'FECHADA') {
      return response.status(400).json({ message: "Esta comanda já está fechada." });
    }
    const totalResult = await db.get(
      `SELECT SUM(quantity * unit_price) as total FROM order_items WHERE order_id = ?`,
      [id]
    );

    const totalAmount = totalResult.total || 0;

    await db.run(
      `UPDATE orders SET status_order = 'FECHADA' WHERE id_order = ?`,
      [id]
    );

    return response.status(200).json({
      message: "Comanda fechada com sucesso!",
      order_id: id,
      customer_name: order.customer_name,
      table_number: order.table_number,
      total_to_pay: totalAmount
    });
  } catch (error) {
    console.error("Erro ao fechar comanda:", error);
    return response.status(500).json({ message: "Não foi possível fechar a comanda." });
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeError) {
        console.error("Erro ao fechar o banco no finally:", closeError);
      }
    }
  }
};