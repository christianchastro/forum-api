const AddThread = require('../../Domains/threads/entities/AddThread');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class AddThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(payload, owner) {
        const addThread = new AddThread(payload);
        const addedThread = await this._threadRepository.add(addThread, owner);
        return new AddedThread(addedThread);
    }
}
module.exports = AddThreadUseCase;
