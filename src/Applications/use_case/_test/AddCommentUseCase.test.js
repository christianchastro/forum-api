/* eslint-disable no-undef */
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        // Arrange
        const payload = {
            content: 'Test Content',
        };
        const threadId = 'thread-777';
        const owner = 'user-123';

        const mockAddedComment = new AddedComment({
            id: 'comment-777',
            content: payload.content,
            owner,
        });

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.verify = jest.fn(async () => Promise.resolve());
        mockCommentRepository.add = jest.fn(() => Promise.resolve(mockAddedComment));

        const addCommentUseCase = new AddCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        const addedComment = await addCommentUseCase.execute(payload, threadId, owner);

        // Assert
        expect(addedComment).toStrictEqual(new AddedComment({
            id: 'comment-777',
            content: payload.content,
            owner,
        }));
        expect(mockThreadRepository.verify)
            .toBeCalledWith(threadId);
        expect(mockCommentRepository.add)
            .toBeCalledWith(new AddComment({
                content: payload.content,
            }), threadId, owner);
    });
});
