/* eslint-disable no-undef */
const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('DeleteCommentUseCase', () => {
    it('should orchestrating the delete comment action correctly', async () => {
        // Arrange
        const owner = 'user-123';
        const threadId = 'thread-777';
        const commentId = 'comment-777';

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.verify = jest.fn(() => Promise.resolve());
        mockCommentRepository.verifyByOwner = jest.fn(() => Promise.resolve());
        mockCommentRepository.delete = jest.fn(() => Promise.resolve());

        const deleteCommentUseCase = new DeleteCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        await deleteCommentUseCase.execute(owner, threadId, commentId);

        // Assert
        expect(mockThreadRepository.verify)
            .toBeCalledWith(threadId);
        expect(mockCommentRepository.verifyByOwner)
            .toBeCalledWith(commentId, owner);
        expect(mockCommentRepository.delete)
            .toBeCalledWith(commentId);
    });
});
