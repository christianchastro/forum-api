/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('threads', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        title: {
            type: 'TEXT',
            notNull: true,
        },
        body: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
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

    pgm.addConstraint('threads', 'fk_threads.owner_threads.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    pgm.dropConstraint('threads', 'fk_threads.owner_threads.id');
    pgm.dropTable('threads');
};
