const User = require('../models/user')
const Store = require('../models/store')
const Profile = require('../models/profile')
const { CustomError } = require('./error')
const { logError } = require('./log')
const { decodeToken } = require('./jwt')

const tryLoginByToken = async (token, profileId) => {
  try {
    if (!token) {
      throw new CustomError('Token cannot be empty')
    }

    let publicKey = process.env.APP_PUBLIC_KEY

    let decoded = await decodeToken(token, publicKey)

    if (!decoded) {
      throw new CustomError('Invalid token')
    }

    if (!decoded?._id) throw new CustomError('Invalid token')

    const user = await User.findOne({ _id: decoded._id, deleted: false })
      .select(User.publicFields())
      .exec()

    if (!user) throw new CustomError('User not found')

    let profile = null

    if (profileId) {
      profile = await Profile.findOne({
        _id: profileId,
        user: user._id,
        deleted: false,
      })
        .populate('store', Store.publicFields())
        .exec()

      if (!profile) {
        throw new CustomError('Profile not found')
      }
    }

    return {
      authenticated: true,
      user,
      profile,
    }
  } catch (error) {
    logError(error)

    return {
      authenticated: false,
      user: null,
      profile: null,
    }
  }
}

const checkPermissions = async (
  ctx,
  permissions = [],
  ensureProfile = false
) => {
  if (!ctx || typeof ctx !== 'object') {
    throw new CustomError('Invalid context')
  }

  if (!Array.isArray(permissions)) {
    throw new CustomError('Invalid permissions')
  }

  const { auth } = ctx

  if (!auth?.authenticated) {
    throw new CustomError('Unauthorized')
  }

  const { user, profile } = auth

  if (ensureProfile && !profile) {
    throw new CustomError('Unauthorized')
  }

  const permissionChecks = {
    authenticated: () => auth?.authenticated,
    superadmin: () => user?.admin === true,
    admin: () => profile?.role === 'admin',
    staff: () => profile?.role === 'staff',
  }

  for (const perm of permissions) {
    const check = permissionChecks[perm]
    if (check && check()) {
      return true
    }
  }

  throw new CustomError('Unauthorized')
}

module.exports = {
  tryLoginByToken,
  checkPermissions,
}
