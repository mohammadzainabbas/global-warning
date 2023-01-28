if (process.env.NODE_ENV === "production") {
    // module.exports = require("./configureStore.prod");
    store = pro;
} else {
    // module.exports = require("./configureStore.dev");
    store = dev;
}

export default store;