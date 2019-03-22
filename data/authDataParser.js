const parseAuthData = data => {
  const rpidHash = data.slice( 0, 32)
  const flagsBuf = data.slice(32, 33)
  const counter  = data.slice(33, 37)

  const flags = {
    up: !!(flagsBuf & 0x01),
    uv: !!(flagsBuf & 0x04),
    at: !!(flagsBuf & 0x40),
    ed: !!(flagsBuf & 0x80),
    buffer: flagsBuf
  }

  const aaguid   = data.slice(37, 53)

  const tmp  = data.slice(53, 55)
  const credentialIdLength   = (tmp[0] << 8) + tmp[1]

  const credentialId         = data.slice(55, 55 + credentialIdLength)
  const credentialId_base64  = Base64.encode(credentialId)

  const COSEPubKeyBuf        = data.slice(55 + credentialIdLength)
  const COSEPubKey           = CBOR.decode(COSEPubKeyBuf.buffer)

  return { rpidHash, flags, counter, aaguid, credentialId, credentialId_base64, COSEPubKey }
}
