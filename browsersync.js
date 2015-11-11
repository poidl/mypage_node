var bs = require("browser-sync").create();

// .init starts the server
bs.init({
    server: "./"
});

// Now call methods on bs instead of the
// main bs module export
bs.watch("*.html").on('change', bs.reload);
bs.watch("*.css").on('change', bs.reload);
bs.watch("*.js").on('change', bs.reload);
bs.watch("content/*.html").on('change', bs.reload);
