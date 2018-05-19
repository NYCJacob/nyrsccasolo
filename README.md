#Intro
This is the website for the New York SCCA Autocross Club.  I took a very old design and have been gradually updated the code.

For now, it is at least somewhat responsive and mobile ready using Bootstrap and jQuery.

The site is pretty active during the summer and fall when the club has events. Each event often has close to 100 competitors.
t
# Build
Gulp is used for the build system but there is no 'build' task to run everything.  Gulp seems to be having issues with very large html files.  This is because the results from events results in large table.  It would be better to serve up the data another way but I haven't had the time to work on it.
#Issues
- not using gulp 4 yet 
- not using bootstrap 4 yet
- gulpfile has a lot of old tasks no longer needed as the site moved to jquery3 bootstsrap 337 and issues with vinly file names in task pipe
    * so **min-html specifies one file instead of a * blob and needs to be changed for each html** which sucks, and also sometimes fails, but could find a better solution until a larger upgrade is done.  
- vertical scroll bar 
- gulp html replace/minifier is throwing error possibly on large html file
- contact dropdown gets cutoff at right margin
- no mvc duplicate code on webpages
- results do not appear on iphone for some users