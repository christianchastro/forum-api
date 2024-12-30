/* eslint-disable no-undef */
const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('GetThreadUseCase', () => {
    it('should throw NotFoundError when thread not found', async () => {
        // Arrange
        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.getById = jest.fn()
            .mockImplementation(() => Promise.reject(new NotFoundError('Thread tidak ditemukan')));
        const getThreadUseCase = new GetThreadUseCase({ threadRepository: mockThreadRepository });

        // Action & Assert
        await expect(getThreadUseCase.execute('thread-000'))
            .rejects
            .toThrowError(new NotFoundError('Thread tidak ditemukan'));
    });

    it('should orchestrating the get thread action correctly', async () => {
        // Arrange
        const threadId = 'thread-777';
        const commentId = 'comment-777';
        const dateNow = new Date().toISOString();
        const mockGetThread = {
            id: threadId,
            title: 'Test Title',
            body: 'Test Body',
            date: dateNow,
            username: 'dicoding',
        };

        const mockGetComments = [{
            id: commentId,
            date: dateNow,
            content: 'Test Comment',
            is_deleted: false,
            username: 'dicoding',
        }];

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.getById = jest.fn()
            .mockImplementation(() => Promise.resolve(mockGetThread));
        mockCommentRepository.getByThreadId = jest.fn()
            .mockImplementation(() => Promise.resolve(mockGetComments));

        const getThreadUseCase = new GetThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        const commentedThread = await getThreadUseCase.execute(threadId);

        // Assert
        expect(commentedThread)
            .toStrictEqual({
                id: threadId,
                title: 'Test Title',
                body: 'Test Body',
                date: dateNow,
                username: 'dicoding',
                comments: [{
                    id: commentId,
                    username: 'dicoding',
                    date: dateNow,
                    content: 'Test Comment',
                }],
            });
        expect(mockThreadRepository.getById)
            .toBeCalledWith(threadId);
        expect(mockCommentRepository.getByThreadId)
            .toBeCalledWith(threadId);
    });

    it('should orchestrating the get thread action correctly with comment is deleted', async () => {
        // Arrange
        const threadId = 'thread-777';
        const commentId = 'comment-777';
        const dateNow = new Date().toISOString();
        const mockGetThread = {
            id: threadId,
            title: 'Test Title',
            body: 'Test Body',
            date: dateNow,
            username: 'dicoding',
        };

        const mockGetComments = [{
            id: commentId,
            date: dateNow,
            content: 'Test Comment',
            is_deleted: true,
            username: 'dicoding',
        }];

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.getById = jest.fn()
            .mockImplementation(() => Promise.resolve(mockGetThread));
        mockCommentRepository.getByThreadId = jest.fn()
            .mockImplementation(() => Promise.resolve(mockGetComments));

        const getThreadUseCase = new GetThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        const commentedThread = await getThreadUseCase.execute(threadId);

        // Assert
        expect(commentedThread).toStrictEqual({
            id: threadId,
            title: 'Test Title',
            body: 'Test Body',
            date: dateNow,
            username: 'dicoding',
            comments: [{
                id: commentId,
                username: 'dicoding',
                date: dateNow,
                content: '**komentar telah dihapus**',
            }],
        });
        expect(mockThreadRepository.getById)
            .toBeCalledWith(threadId);
        expect(mockCommentRepository.getByThreadId)
            .toBeCalledWith(threadId);
    });
});
