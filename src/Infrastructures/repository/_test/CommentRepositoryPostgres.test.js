/* eslint-disable no-undef */
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');

describe('CommentRepositoryPostgres', () => {
    beforeEach(async () => {
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.add({});
    });

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('add function', () => {
        it('should persist add comment and return registered comment correctly', async () => {
            // Arrange
            const addComment = new AddComment({ content: 'Test Comment' });
            const fakeIdGenerator = () => '777';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedComment = await commentRepositoryPostgres.add(addComment, 'thread-777', 'user-123');

            // Assert
            expect(addedComment).toStrictEqual(new AddedComment({
                id: 'comment-777',
                content: 'Test Comment',
                owner: 'user-123',
            }));
            const comment = await CommentsTableTestHelper.findById('comment-777');
            expect(comment).toHaveLength(1);
        });
    });

    describe('verify function', () => {
        it('should throw NotFoundError when comment not found', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action
            await CommentsTableTestHelper.add({});

            // Assert
            await expect(commentRepositoryPostgres.verify('comment-000'))
                .rejects
                .toThrowError(new NotFoundError('Comment tidak ditemukan'));
        });

        it('should not throw NotFoundError when id available', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action
            await CommentsTableTestHelper.add({});

            // Assert
            await expect(commentRepositoryPostgres.verify('comment-777'))
                .resolves
                .not
                .toThrowError(new NotFoundError('Comment tidak ditemukan'));
        });
    });

    describe('verifyByOwner function', () => {
        it('should throw NotFoundError when comment not found', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action
            await CommentsTableTestHelper.add({});

            // Assert
            await expect(() => commentRepositoryPostgres.verifyByOwner('comment-000', 'user-123'))
                .rejects
                .toThrowError(new NotFoundError('Comment tidak ditemukan'));
        });

        it('should throw error AuthorizationError', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action
            await CommentsTableTestHelper.add({});

            // Assert
            await expect(commentRepositoryPostgres.verifyByOwner('comment-777', 'user-666'))
                .rejects
                .toThrowError(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
        });

        it('should not throw NotFoundError when user and id correct', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action
            await CommentsTableTestHelper.add({});

            // Assert
            await expect(commentRepositoryPostgres.verifyByOwner('comment-777', 'user-123'))
                .resolves
                .not
                .toThrowError(new NotFoundError('Comment tidak ditemukan'));
        });

        it('should not throw AuthorizationError when user and id correct', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action
            await CommentsTableTestHelper.add({});

            // Assert
            await expect(commentRepositoryPostgres.verifyByOwner('comment-777', 'user-123'))
                .resolves
                .not
                .toThrowError(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
        });
    });

    describe('getByThreadId function', () => {
        it('should return comments by Thread Id', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            await CommentsTableTestHelper.add({});

            // Action
            const comments = await commentRepositoryPostgres.getByThreadId('thread-777');
            const user = await UsersTableTestHelper.findUsersById('user-123');

            // Assert
            expect(comments).toHaveLength(1);
            const data = comments[0];
            expect(data.id).toBe('comment-777');
            expect(data.date).toBeDefined();
            expect(data.content).toBe('Added Comment Content');
            expect(data.is_deleted).toBe(false);
            expect(data.username).toBe(user[0].username);
        });
    });

    describe('delete function', () => {
        it('should throw NotFoundError when comment not found', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(commentRepositoryPostgres.delete('comment-777'))
                .rejects
                .toThrowError(new NotFoundError('Comment gagal dihapus. Id tidak ditemukan'));
        });
        it('should delete comment from database', async () => {
            // Arrange
            const addComment = new AddComment({ content: 'Test Comment' });
            const fakeIdGenerator = () => '777';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            await commentRepositoryPostgres.add(addComment, 'thread-777', 'user-123');

            // Action
            await commentRepositoryPostgres.delete('comment-777');

            // Assert
            const comment = await CommentsTableTestHelper.findById('comment-777');
            const data = comment[0];
            expect(data.is_deleted).toEqual(true);
        });
    });
});
