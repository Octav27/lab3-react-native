import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('recipes.db');

export const initDatabase = async () => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL,
        image TEXT
      );
    `);
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export const insertRecipe = async (name, ingredients, instructions, image) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO recipes (name, ingredients, instructions, image) VALUES (?, ?, ?, ?)',
      [name, ingredients, instructions, image]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error inserting recipe:', error);
    throw error;
  }
};

export const getAllRecipes = async () => {
  try {
    const allRows = await db.getAllAsync('SELECT * FROM recipes');
    return allRows;
  } catch (error) {
    console.error('Error getting all recipes:', error);
    return [];
  }
};

export const getRecipeById = async (id) => {
  try {
    const row = await db.getFirstAsync('SELECT * FROM recipes WHERE id = ?', [id]);
    return row;
  } catch (error) {
    console.error('Error getting recipe by id:', error);
    return null;
  }
};

export const updateRecipe = async (id, name, ingredients, instructions, image) => {
  try {
    await db.runAsync(
      'UPDATE recipes SET name = ?, ingredients = ?, instructions = ?, image = ? WHERE id = ?',
      [name, ingredients, instructions, image, id]
    );
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
};

export const deleteRecipe = async (id) => {
  try {
    await db.runAsync('DELETE FROM recipes WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
};

export default db;
