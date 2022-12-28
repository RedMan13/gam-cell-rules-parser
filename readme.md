movements:
`/l` move left
`/r` move right
`/u` move up
`/d` move down
`/m` move in the same direction as the trigering cell
`/c` rotate clockwise
`/w` rotate counter-clockwise

trigers:
`l:` triger on cells pushing left
`r:` triger on cells pushing right
`u:` triger on cells pushing up
`d:` triger on cells pushing down
`a:` triger on cells pushing anywhere
`c:` triger on cells rotating this cell
`t:` trigers every time this cell is ticked

actions:
`l>` move the cell on the left in a given way
`r>` move the cell on the right in a given way
`u>` move the cell on the up in a given way
`d>` move the cell on the down in a given way
`t>` return a value, ends this functions execution and sets the get value of this function to the returned value

data readers:
`?d` the direction of a given cell
`?n` the id of the given cell
`?c` check if there is a cell in a given location

formatting:
double quotes are strings/numbers
variables are defined and set using name=val
functions can only be defined, never set
`!s` stops the current part of this rule
`name$=(inputs){commands}` function, works exactly the same as variable definitions but can store rules and can be inherited from other cells
`$(inputs)name` runs a specified function
`@name` accesses a variable, put infront of the round bracket in the run rule command to state what rule to run, replace name with the name of the var/rule
`?|` run a command if the thing on the left of it is true, formated as `t/r?com|otrcom`: t/r is true/false, com is command, otrcom is other command
`na` do nothing

internal vars:
`cdir` current direction
`cnam` the type of this cell
`imp` function, imports functions and trigers from a cell/module, usage: `$(type <string>)imp`
`pos` function, gets a cell at a specified location for acting on, usage: `$(x: <number>, y: <number>)pos`
`call` function, run a function from the main tile sprite, usage: `$(fname: <string>)call`
`newNeighbor` function, creates a new neighbor with a specific id in a specific location, usage: `$(dir: <number|direction|position>, id: <string>)newNeighbor`

examples:
move `$("relative moveable vertically")imp,tick$=(){u>/u,/u},t:$()tick`
