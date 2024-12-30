class GetThreadUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(id) {
        const thread = await this._threadRepository.getById(id);

        const getComments = await this._commentRepository.getByThreadId(id);
        const comments = getComments.map((data) => ({
            id: data.id,
            username: data.username,
            date: data.date,
            content: !data.is_deleted ? data.content : '**komentar telah dihapus**',
        }));

        return {
            ...thread,
            comments,
        };
    }
}

module.exports = GetThreadUseCase;
