const crypto = require('crypto')
const base32 = require('base32')

function randomId() {
  return base32.encode(crypto.randomBytes(4))
}

const GitHubAPI = require('github')
const github = GitHubAPI()

module.exports = async ({ username, password, otp }) => {
  github.authenticate({
    type: 'basic',
    username,
    password
  })

  const request = await new Promise((resolve, reject) => {
    github.authorization.create(
      {
        scopes: [
          'user',
          'public_repo',
          'repo',
          'repo:status',
          'gist',
          'read:org',
          'user:email',
          'repo_deployment',
          'write:repo_hook'
        ],
        note: `esops_${randomId()}`,
        headers: otp
          ? {
              'X-GitHub-OTP': otp
            }
          : null
      },
      (err, res) => {
        if (err) {
          if (err.code === 401 && err.headers['x-github-otp']) {
            // otpTypeNeeded = 'sms' | 'app'
            const otpTypeNeeded = err.headers['x-github-otp'].split('; ')[1]
            resolve({ otp: otpTypeNeeded })
          } else {
            reject(err)
          }
        } else resolve({ res })
      }
    )
  })

  if (request.otp) {
    return {
      otpNeeded: true,
      otpInvalid: otp ? true : undefined,
      type: request.otp.type
    }
  } else if (request.data) {
    return request.data
  } else {
    throw new Error('an unknown error occured', request)
  }
}
