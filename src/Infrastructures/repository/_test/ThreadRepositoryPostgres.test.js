/* eslint-disable no-undef */
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

describe('ThreadRepositoryPostgres', () => {
    beforeEach(async () => {
        await UsersTableTestHelper.addUser({});
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('add function', () => {
        it('should persist add thread and return registered thread correctly', async () => {
            // Arrange
            const addThread = new AddThread({ title: 'Test Title', body: 'Test body' });
            const fakeIdGenerator = () => '777';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedThread = await threadRepositoryPostgres.add(addThread, 'user-123');

            // Assert
            expect(addedThread).toStrictEqual(new AddedThread({
                id: 'thread-777',
                title: addThread.title,
                owner: 'user-123',
            }));
            const thread = await ThreadsTableTestHelper.findById('thread-777');
            expect(thread).toHaveLength(1);
        });
    });

    describe('getById function', () => {
        it('should throw NotFoundError when thread not found', async () => {
            // Arrange
            const addThread = new AddThread({ title: 'Test Title', body: 'Test body' });
            const fakeIdGenerator = () => '777';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepositoryPostgres.add(addThread, 'user-123');

            // Assert
            await expect(threadRepositoryPostgres.getById('thread-000'))
                .rejects
                .toThrowError(new NotFoundError('Thread tidak ditemukan'));
        });
        it('should return thread when thread is found', async () => {
            // Arrange
            const fakeIdGenerator = () => '777';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            await ThreadsTableTestHelper.add({});

            // Action
            const thread = await threadRepositoryPostgres.getById('thread-777');
            const user = await UsersTableTestHelper.findUsersById('user-123');

            // Assert
            expect(thread).not.toBeNull();
            expect(thread.id).toBe('thread-777');
            expect(thread.title).toBe('Add Thread Title');
            expect(thread.body).toBe('Add Thread Body');
            expect(thread.date).toBeDefined();
            expect(thread.username).toBe(user[0].username);
        });
    });

    describe('verify function', () => {
        it('should throw NotFoundError when thread not found', async () => {
            // Arrange
            const addThread = new AddThread({ title: 'Test Title', body: 'Test body' });
            const fakeIdGenerator = () => '777';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepositoryPostgres.add(addThread, 'user-123');

            // Assert
            await expect(() => threadRepositoryPostgres.verify('thread-000'))
                .rejects
                .toThrowError(new NotFoundError('Thread tidak ditemukan'));
        });

        it('should not throw NotFoundError when id available', async () => {
            // Arrange
            const addThread = new AddThread({ title: 'Test Title', body: 'Test body' });
            const fakeIdGenerator = () => '777';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepositoryPostgres.add(addThread, 'user-123');

            // Assert
            expect(threadRepositoryPostgres.verify('thread-777'))
                .resolves
                .not
                .toThrowError(new NotFoundError('Thread tidak ditemukan'));
        });
    });
});
