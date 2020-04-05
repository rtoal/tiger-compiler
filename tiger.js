#!/usr/bin/env node

/*
 * A Tiger Compiler
 *
 * This module contains functions for compiling Tiger programs into JavaScript:
 * one takes the Tiger program as a string, and the other takes in a filename.
 * It can also be used a script, in which case the filename is a command line
 * argument, in addition to options. Synopsis:
 *
 * ./tiger.js -a <filename>
 *     writes out the AST and stops
 *
 * ./tiger.js -i <filename>
 *     writes the decorated AST (semantic graph) then stops
 *
 * ./tiger.js <filename>
 *     fully compiles and writes the compiled JavaScript.
 *
 * ./tiger.js -o <filename>
 *     optimizes the intermediate code before generating JavaScript.
 *
 * Output of the AST uses the object inspection functionality built into Node.js.
 * The decorated AST (semantic graph) is printed as text for now, but graphics
 * would be really nice to add.
 */

const fs = require('fs');
const util = require('util');
const yargs = require('yargs');
const parse = require('./ast/parser');
const analyze = require('./semantics/analyzer');
const graphView = require('./semantics/viewer');
const optimize = require('./semantics/optimizer');
const generate = require('./backend/javascript-generator');

// If compiling from a string, return the AST, IR, or compiled code as a string.
function compile(sourceCode, { astOnly, frontEndOnly, shouldOptimize }) {
  let program = parse(sourceCode);
  if (astOnly) {
    return util.inspect(program, { depth: null, compact: true });
  }
  analyze(program);
  if (shouldOptimize) {
    optimize(program);
  }
  if (frontEndOnly) {
    return graphView(program);
  }
  return generate(program);
}

// If compiling from a file, write to standard output.
function compileFile(filename, options) {
  fs.readFile(filename, 'utf-8', (error, sourceCode) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(compile(sourceCode, options));
  });
}

// Two nice functions if you'd like to embed a compiler in your own apps.
module.exports = { compile, compileFile };

// Run the compiler as a command line application.
if (require.main === module) {
  const { argv } = yargs
    .usage('$0 [-a] [-o] [-i] filename')
    .boolean(['a', 'o', 'i'])
    .describe('a', 'show abstract syntax tree after parsing then stop')
    .describe('o', 'do optimizations')
    .describe('i', 'generate and show the decorated abstract syntax tree then stop')
    .demand(1);
  compileFile(argv._[0], { astOnly: argv.a, frontEndOnly: argv.i, shouldOptimize: argv.o });
}
