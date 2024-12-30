/* eslint-disable no-undef */
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        // Arrange
        const payload = {
            title: 'Test Title',
            body: 'Test Body',
        };
        const mockAddedThread = new AddedThread({
            id: 'thread-777',
            title: payload.title,
            owner: 'user-123',
        });

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.add = jest.fn(() => Promise.resolve(mockAddedThread));

        const getThreadUseCase = new AddThreadUseCase({ threadRepository: mockThreadRepository });

        // Action
        const addedThread = await getThreadUseCase.execute(payload, 'user-123');

        // Assert
        expect(addedThread)
            .toStrictEqual(new AddedThread({
                id: 'thread-777',
                title: payload.title,
                owner: 'user-123',
            }));
        expect(mockThreadRepository.add)
            .toBeCalledWith(new AddThread({
                title: payload.title,
                body: payload.body,
            }), 'user-123');
    });
});
