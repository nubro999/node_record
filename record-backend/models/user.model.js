const db = require('../config/db.config');

class User {
  static async create(user) {
    const [result] = await db.execute(
      'INSERT INTO users (name, state) VALUES (?, ?)',
      [user.name, user.state || 'active']
    );
    return { id: result.insertId, ...user };
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM users');
    return rows;
  }

  static async update(id, user) {
    await db.execute(
      'UPDATE users SET name = ?, state = ? WHERE id = ?',
      [user.name, user.state, id]
    );
    return { id, ...user };
  }

  static async delete(id) {
    await db.execute('DELETE FROM users WHERE id = ?', [id]);
    return { id };
  }
}

module.exports = User;
