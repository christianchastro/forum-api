const AddComment = require('../../Domains/comments/entities/AddComment');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class AddCommentUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(payload, threadId, owner) {
        const addComment = new AddComment(payload);
        await this._threadRepository.verify(threadId);
        const addedComment = await this._commentRepository.add(addComment, threadId, owner);
        return new AddedComment(addedComment);
    }
}

module.exports = AddCommentUseCase;
