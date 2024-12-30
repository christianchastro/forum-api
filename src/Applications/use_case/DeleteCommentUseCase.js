class DeleteCommentUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(owner, threadId, id) {
        await this._threadRepository.verify(threadId);
        await this._commentRepository.verifyByOwner(id, owner);
        this._commentRepository.delete(id);
    }
}

module.exports = DeleteCommentUseCase;
