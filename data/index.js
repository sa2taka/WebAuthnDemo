let ids = {}

const getCredentialRequestOptions = () => {
  const name = document.getElementById('name').value

  const challenge = crypto.getRandomValues(new Uint8Array(32))
  document.getElementById('authn_challenge').value = Base64.encode(challenge)

  const credentialRequestOptions = {
    'challenge': challenge,
    'allowCredentials': [{
      'type': "public-key",
      'id': ids[name]
    }]
  }

  return credentialRequestOptions
}

const getCredentialCreationOptions = () => {
  const name = document.getElementById('name').value

  const challenge = crypto.getRandomValues(new Uint8Array(32))
  document.getElementById('register_challenge').value = Base64.encode(challenge)

  const credentialCreationOptions = {
    'challenge': challenge,
    'rp': {
      'id': 'localhost',
      'name': 'localhost webAuthn Demo'
    },
    'user': {
      'id': strToBin(name),
      'name': name,
      'displayName': name
    },
    'pubKeyCredParams': [
      { 'type': 'public-key', 'alg': -7  },
      { 'type': 'public-key', 'alg': -257 }
    ],
    timeout: 60000,
    attestation: "direct"
  }

  return credentialCreationOptions
}

const register = () => {
  const publicKey = getCredentialCreationOptions()
  console.log(publicKey)
  const name = document.getElementById('name').value

  navigator.credentials.create({ publicKey })
  .then(function (newCredentialInfo) {
    console.log(newCredentialInfo)
    const { id, rawId, response, type } = newCredentialInfo
    const { attestationObject, clientDataJSON } = response
    ids[name] = rawId

    attestation = CBOR.decode(attestationObject)
    attestation.authData = parseAuthData(attestation.authData)

    console.log(JSON.parse(String.fromCharCode.apply(null, new Uint8Array(clientDataJSON))))
    console.log(attestation)

    document.getElementById('register_id').value = id
    document.getElementById('register_rawid').value = formatArrayString(new Uint8Array(rawId))
    document.getElementById('register_attestation').value = JSON.stringify(attestation, null, 2)
    document.getElementById('register_clientData').value = JSON.stringify(JSON.parse(String.fromCharCode.apply(null, new Uint8Array(clientDataJSON))), null, 2)
    document.getElementById('register_type').value = type
  }).catch(function (err) {
     console.log(err)
  })
}

const authn = () => {
  const publicKey = getCredentialRequestOptions()
  console.log(publicKey)

  navigator.credentials.get({ publicKey })
  .then(function (assertion) {
    console.log(assertion)

    const { id, rawId, response, type } = assertion
    const { authenticatorData, clientDataJSON, signature, userHandle } = response

    const authenticator = parseAuthData(new Uint8Array(authenticatorData))

    document.getElementById('authn_id').value = id
    document.getElementById('authn_rawid').value = formatArrayString(new Uint8Array(rawId))
    document.getElementById('authn_authenticator').value = JSON.stringify(authenticator, null, 2)
    document.getElementById('authn_clientData').value = JSON.stringify(JSON.parse(String.fromCharCode.apply(null, new Uint8Array(clientDataJSON))), null, 2)
    document.getElementById('authn_signature').value = formatArrayString(new Uint8Array(signature))
    document.getElementById('authn_userHandle').value =formatArrayString(new Uint8Array(userHandle))
    document.getElementById('authn_type').value = type
  }).catch(function (err) {
    console.log(err)
  })
}

window.addEventListener('load', () => {
  const registerButton = document.getElementById('register-button')
  const authnButton    = document.getElementById('authn-button')

  registerButton.addEventListener('click', register)
  authnButton.addEventListener('click', authn)
})
