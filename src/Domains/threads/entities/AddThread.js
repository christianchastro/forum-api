class AddThread {
    constructor(payload) {
        this._verify(payload);

        const { title, body } = payload;

        this.title = title;
        this.body = body;
    }

    _verify({ title, body }) {
        if (!title || !body) {
            throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }
        if (typeof title !== 'string' || typeof body !== 'string') {
            throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
        if (title.length > 50) {
            throw new Error('ADD_THREAD.TITLE_LIMIT_CHAR');
        }
    }
}
module.exports = AddThread;
