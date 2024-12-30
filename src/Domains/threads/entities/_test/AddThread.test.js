/* eslint-disable no-undef */
const AddThread = require('../AddThread');

describe('a AddThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            body: 'Add Thread Body',
        };
        // Action and Assert
        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });
    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            title: 777,
            body: true,
        };
        // Action and Assert
        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
    it('should throw error when title contains more than 50 character', () => {
        // Arrange
        const payload = {
            title: 'Add Thread Title Add Thread Title Add Thread Title Add Thread Title',
            body: 'Add Thread Body',
        };
        // Action and Assert
        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.TITLE_LIMIT_CHAR');
    });
    it('should create addThread object correctly', () => {
        // Arrange
        const payload = {
            title: 'Add Thread Title',
            body: 'Add Thread Body',
        };
        // Action
        const { title, body } = new AddThread(payload);
        // Assert
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
    });
});
