/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
    async add({
        id = 'thread-777',
        title = 'Add Thread Title',
        body = 'Add Thread Body',
        owner = 'user-123',
    }) {
        const dateNow = new Date().toISOString();
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6)',
            values: [id, title, body, owner, dateNow, dateNow],
        };

        await pool.query(query);
    },

    async findById(id) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM threads WHERE 1=1');
    },
};

module.exports = ThreadsTableTestHelper;
