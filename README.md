# tiger-compiler

A compiler for a slight modification of Andrew Appel’s Tiger language from the 1990s.

The dialect of Tiger for this project is defined as beginning with the language definition in [the Tiger Language Reference Manual](http://www.cs.columbia.edu/~sedwards/classes/2002/w4115/tiger.pdf) and modified as follows:

 * It uses Unicode instead of just ASCII.
 * It does not use `\^c`, `\ddd`, or `\spaces\`; instead, it uses JavaScript `\u{...}` escapes.
 * It does not use separate namespaces for types and non-types.
 * It throws out the standard functions `flush` and `getchar`.

The rational for this changes is:

  * ASCII is just plain wrong. When Appel wrote the language in the early 1990s, he might not have known any better.
  * Writing `var x: x` is just silly, well at least in my humble opinion.
  * This compiler targets the async-friendly language JavaScript, where synchronous flushing and getting don’t really apply.
