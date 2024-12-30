const routes = (handler) => ([
    {
        method: 'POST',
        path: '/threads/{threadId}/comments',
        handler: handler.postHandler,
        options: {
            auth: 'forumapi_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/threads/{threadId}/comments/{commentId}',
        handler: handler.deleteHandler,
        options: {
            auth: 'forumapi_jwt',
        },
    },
]);

module.exports = routes;
