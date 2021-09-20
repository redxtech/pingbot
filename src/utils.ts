// utility functions

// random number generator
const random = upTo => (Math.floor(Math.random() * upTo) + 1)

// probability tester
const should = outOf => random(outOf) === 1

// generate a random string of characters to use as a nickname
const generateNickname = () => {
  // initialize empty array to store the name in
  const nicknameArray = []

  // a list of possible characters to show up in the nickname
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-=_+[]\{}|;\':",./<>? '

  // the length of the nickname, between 6 & 26
  const nicknameLength = 6 + random(20)

  // push a random character from the characters into the nickname array <nicknameLength> times
  for (let i = 0; i < nicknameLength; i++) {
    nicknameArray.push(characters.charAt(random(characters.length)))
  }

  // return the nickname as a string
  return nicknameArray.join('')
}

module.exports = {
  should,
  generateNickname
}
