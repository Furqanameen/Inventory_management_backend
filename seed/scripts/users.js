const User = require('../../models/user')
const { encryptPassword } = require('../../utils/password')
const { logInfo } = require('../../utils/log')

const createAdmin = async () => {
  logInfo('Creating admin')
  const emails = ['admin@admin.com']

  for (const email of emails) {
    const admin = await User.findOne({ email }).exec()
    if (admin) {
      logInfo('Admin already exists')
      return
    }

    await User.create({
      name: 'Super Admin',
      email: email,
      encryptedPassword: await encryptPassword('admin'),
      admin: true,
      deleted: false,
      deletedAt: null,
    })
  }

  logInfo('Admin created')
}

module.exports = {
  createAdmin,
}
