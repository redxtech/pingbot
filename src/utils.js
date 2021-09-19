// utility functions

// random number generator
const random = upTo => (Math.floor(Math.random() * upTo) + 1)

// probability tester
const should = outOf => random(outOf) === 1

module.exports = {
  should 
}
