class AddComment {
    constructor(payload) {
        this._verify(payload);
        this.content = payload.content;
    }

    _verify({ content }) {
        if (!content) {
            throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }
        if (typeof content !== 'string') {
            throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddComment;
