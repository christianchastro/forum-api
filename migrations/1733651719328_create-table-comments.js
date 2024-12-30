/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('comments', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        thread_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        is_deleted: {
            type: 'BOOLEAN',
            notNull: true,
            default: false,
        },
        created_at: {
            type: 'TEXT',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'TEXT',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    pgm.addConstraint('comments', 'fk_comments.owner_comments.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('comments', 'fk_comments.thread_comments.id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    pgm.dropConstraint('comments', 'fk_comments.owner_comments.id');
    pgm.dropConstraint('comments', 'fk_comments.thread_comments.id');
    pgm.dropTable('comments');
};
