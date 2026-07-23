const cache = new Map();

module.exports = {
    set(userId, data) {
        cache.set(userId, data);

        setTimeout(() => {
            cache.delete(userId);
        }, 5 * 60 * 1000);
    },

    get(userId) {
        return cache.get(userId);
    },

    delete(userId) {
        cache.delete(userId);
    }
};
