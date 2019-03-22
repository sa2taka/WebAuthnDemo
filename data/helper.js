const strToBin = str => {
  return Uint8Array.from(str, c => c.charCodeAt(0))
}

const formatArrayString = array => {
  let returnStr = '['
  let isFirst = true
  array.forEach( item => {
    const c = isFirst ? '' : ', '
    isFirst = false
    returnStr += c + item.toString(16)
  })

  return returnStr + ']'
}
