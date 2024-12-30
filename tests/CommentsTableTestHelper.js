/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
    async add({
        id = 'comment-777',
        content = 'Added Comment Content',
        threadId = 'thread-777',
        owner = 'user-123',
    }) {
        const dateNow = new Date().toISOString();
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7)',
            values: [id, content, threadId, owner, false, dateNow, dateNow],
        };

        await pool.query(query);
    },

    async findById(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM comments WHERE 1=1');
    },
};

module.exports = CommentsTableTestHelper;
