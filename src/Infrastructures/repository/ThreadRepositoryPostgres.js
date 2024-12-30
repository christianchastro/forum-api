const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async add(addThread, owner) {
        const id = `thread-${this._idGenerator()}`;
        const { title, body } = addThread;
        const dateNow = new Date().toISOString();

        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $5) RETURNING id, title, owner',
            values: [id, title, body, owner, dateNow],
        };

        const result = await this._pool.query(query);

        return new AddedThread(result.rows[0]);
    }

    async verify(id) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('Thread tidak ditemukan');
        }
    }

    async getById(id) {
        const query = {
            text: `SELECT t.id, t.title, t.body, t.created_at as date, u.username
            FROM threads as t
            LEFT JOIN users as u ON t.owner = u.id
            WHERE t.id = $1`,
            values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Thread tidak ditemukan');
        }
        return result.rows[0];
    }
}

module.exports = ThreadRepositoryPostgres;
