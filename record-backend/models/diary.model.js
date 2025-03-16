const db = require('../config/db.config');

class Diary {
  static async create(diary) {
    const [result] = await db.execute(
      'INSERT INTO diaries (user_id, date, text, keywords, feeling) VALUES (?, ?, ?, ?, ?)',
      [diary.user_id, diary.date || new Date(), diary.text, JSON.stringify(diary.keywords), JSON.stringify(diary.feeling)]
    );
    return { id: result.insertId, ...diary };
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM diaries WHERE id = ?', [id]);
    if (rows.length > 0) {
      rows[0].keywords = JSON.parse(rows[0].keywords);
      rows[0].feeling = JSON.parse(rows[0].feeling);
    }
    return rows[0];
  }

  static async findByUserId(userId) {
    const [rows] = await db.execute('SELECT * FROM diaries WHERE user_id = ?', [userId]);
    return rows.map(row => {
      row.keywords = JSON.parse(row.keywords);
      row.feeling = JSON.parse(row.feeling);
      return row;
    });
  }

  static async update(id, diary) {
    await db.execute(
      'UPDATE diaries SET text = ?, keywords = ?, feeling = ? WHERE id = ?',
      [diary.text, JSON.stringify(diary.keywords), JSON.stringify(diary.feeling), id]
    );
    return { id, ...diary };
  }

  static async delete(id) {
    await db.execute('DELETE FROM diaries WHERE id = ?', [id]);
    return { id };
  }
}

module.exports = Diary;
