const routes = (handler) => ([
    {
        method: 'POST',
        path: '/threads',
        handler: handler.postHandler,
        options: {
            auth: 'forumapi_jwt',
        },
    },
    {
        method: 'GET',
        path: '/threads/{threadId}',
        handler: handler.getHandler,
    },
]);

module.exports = routes;
