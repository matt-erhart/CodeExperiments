# typscript via babel 
https://iamturns.com/typescript-babel/

1) Namespaces.

Solution: don’t use them! They’re outdated. Use the industry standard ES6 modules (import / export) instead. The recommended tslint rules ensure namespaces are not used.
2) Casting a type with the<newtype>x syntax.

Solution: Use x as newtype instead.
3) Enums that span multiple declarations (i.e. enum merging).

I’m not sure what this is. I have searched online for “enum merging” and found nothing. Can anyone help? Please let me know in the comments!

4) Legacy-style import / export syntax.

Examples: import foo = require(...) and export = foo.
In all my years of TypeScriptin’ I’ve never come across this. Who codes this way? Stop it!

# any testing lib
cannot test css selectors

# recognize touch gestures
http://hammerjs.github.io/getting-started/