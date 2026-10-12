import { openDatabase } from "../database.js";

export const listProducts = async (request, response) => {
  let db;
  try {
    db = await openDatabase();

    const results = await db.all(`SELECT * FROM products`);

    return response.status(200).json(results);
  } catch (error) {
    console.error("Erro ao listar produtos", error);
    return response.status(500).json({ message: "Erro ao listar produtos" });
  } finally {
    if (db) await db.close();
  }
};

export const registerProduct = async (request, response) => {
  let db;
  try {
    const { name_product, price_product, category_product } = request.body;

    if (!name_product || !price_product || !category_product) {
      return response
        .status(400)
        .json({ message: "Todos os campos são obrigatórios" });
    }

    db = await openDatabase();
    const data = await db.run(
      `INSERT INTO products (name_product, price_product, category_product) VALUES (?, ?, ?)`,
      [name_product, price_product, category_product],
    );

    await db.close();

    return response.status(201).json({
      id: data.lastID,
      name_product,
      price_product,
      category_product,
    });
  } catch (error) {
    if (db) {
      try {
        await db.close();
      } catch (closeError) {
        console.error("Erro ao fechar o banco no catch:", closeError);
      }
    }

    console.error("Erro na rota registerProcut:", error);

    return response.status(500).json({
      message: "Não foi possível cadastrar seu produto!",
    });
  }
};
