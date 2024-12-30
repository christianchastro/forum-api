const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async add(addComment, threadId, owner) {
        const id = `comment-${this._idGenerator()}`;
        const { content } = addComment;
        const dateNow = new Date().toISOString();

        const query = {
            text: `INSERT INTO comments(id, content, thread_id, owner, is_deleted, created_at, updated_at) 
            VALUES($1, $2, $3, $4, $5, $6, $6) RETURNING id, content, owner`,
            values: [id, content, threadId, owner, false, dateNow],
        };

        const result = await this._pool.query(query);
        return new AddedComment(result.rows[0]);
    }

    async verify(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('Comment tidak ditemukan');
        }
    }

    async verifyByOwner(id, owner) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('Comment tidak ditemukan');
        }

        if (result.rows[0].owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async getByThreadId(threadId) {
        const query = {
            text: `SELECT c.id, c.updated_at as date, c.content, c.is_deleted, u.username 
            FROM comments as c
            INNER JOIN users as u ON c.owner = u.id
            WHERE c.thread_id = $1`,
            values: [threadId],
        };

        const { rows } = await this._pool.query(query);
        return rows;
    }

    async delete(id) {
        const query = {
            text: 'UPDATE comments SET is_deleted = TRUE WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Comment gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = CommentRepositoryPostgres;
