module.exports = {
    port: 6800,
    session: {
        secret: 'blog',
        key: 'blog',
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 365 * 24 * 60 * 60 * 1000,
        }
    },
    url: 'mongodb://localhost:27017/book'
}