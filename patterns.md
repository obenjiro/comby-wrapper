https://habr.com/ru/company/pvs-studio/blog/659885/

# Consecutive Assigment (warning)

if (:[_]) {
   :[_]
} else {:[_] 
   :[x:e] += :[y] 
:[_]} 
:[_]
:[x:e] = :[_:e]


:[x:e] += :[y] 
:[x:e] = :[_:e]

https://pvs-studio.com/ru/docs/warnings/v3008/

# Identical sub-expressions

if (:[1] && :[1])

if (:[1] || :[1])

https://pvs-studio.com/ru/docs/warnings/v3001/

# The 'then' statement is equivalent to the 'else' statement

if (:[_]) :[1] else :[1]
if (:[_]) { :[1] } else { :[1] }
if :[_] { :[1] } else { :[1] }
if :[1] else :[1]

https://pvs-studio.com/ru/docs/warnings/v3004/