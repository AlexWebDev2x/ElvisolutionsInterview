exports.uncaughtException = err =>
    {
        console.log('GLOBAL exception handler:', err.name, err.message);

        // We can't close server gracefully here so just exit
        console.log('Shutting down...');
        process.exit(-1);
    };

exports.unhandledRejection = server => err =>
    {
        console.log('GLOBAL rejection handler:', err.name, err.message);
        
        // Gracefully close the server:
        server.close( () =>
            {
                console.log('Shutting down...');
                process.exit(-2);
            });
    };

exports.sigTerm = server => () =>
    {
        console.log('SIGTERM received! Shutting down gracefully...');
        server.close( () => console.log('Process terminated.') );
    };


exports.dbError = (err, client) =>
    {
        console.error('Unexpected error on idle client', err);
        process.exit(-3);
    };

exports.catchAsync = (fn, name) => (req, res, next) =>
    {
        // we can use catch here just because any async function always returns a promise so it's possible instead of async/await keywords use ordinary then/catch methods
        return fn(req, res, next)
                .catch(err =>
                    {
                        if (name)
                            console.log(`Error in ${ name }(): [${ err.name }] - ${ err.message }`);

                        next(err);
                    });
    }


