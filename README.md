#Intro
This is the website for the New York SCCA Autocross Club.  I took a very old design and have been gradually updated the code.

For now, it is at least somewhat responsive and mobile ready using Bootstrap and jQuery.

The site is pretty active during the summer and fall when the club has events. Each event often has close to 100 competitors.

# Build
Gulp is used for the build system but there is no 'build' task to run everything.  Gulp seems to be having issues with very large html files.  This is because the results from events results in large table.  It would be better to serve up the data another way but I haven't had the time to work on it.
#Issues
- vertical scroll bar 
- gulp html replace/minifier is throwing error possibly on large html file
- contact dropdown gets cutoff at right margin
- no mvc duplicate code on webpages