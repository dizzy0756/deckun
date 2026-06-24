## Topic
    Exception handling:
        try - tries to execute a block of code
        except - catches a particular error
        else - executes a block of code, if no error was caught
        finally - always executes
            useful for - closing files, closing database connections, cleaning resources
        raise - creating our own errors / validation
    
    Iterators:
        must be a collection
        must have __iter__ and __next__(with raise StopIteration)

    Generators:
        behaves like iterators
        uses yield instead of return
        yield pauses and resumes a function
        useful in large datasets
        memory efficient

## Important
    Design of the program is more important than the code itself.
    Habit of drawing out a abstract sketch of the program architecture before writing the code.    