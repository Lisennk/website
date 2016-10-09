REM place jekyllpollingwatch.bat in your jekyll project directory and run from commandline

start ruby -run -e httpd _site -p4000
:loop
start /WAIT /B jekyll build
timeout 5 > nul
goto loop
