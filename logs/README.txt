The console will be logged in this folder. Everytime the bot is started, a new file will be created.
They are named like this:
YYYY-MM-DD_HH-MM-SS.log
Example: 2022-09-11_01-30-05.log if the bot was started on September 5, 2022 at 1:30:05
In config.js, you can set a limit for these log files (or disable them).

Additionally, a latest.log file will be created (ignoring the config.js file).
This file is deleted and re-created everytime the bot is started.

There also is a logins.log file which is just a list of all logins (with a timestamp).
It's creation is also not affected by the configuration.
