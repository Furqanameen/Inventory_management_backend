const User = require('../../models/user')
const Store = require('../../models/store')
const Profile = require('../../models/profile')

module.exports = async () => {
  const users = await User.find({ admin: true }).exec()
  const stores = await Store.find({}).exec()

  for (const user of users) {
    for (const store of stores) {
      const profile = await Profile.findOne({
        user: user._id,
        store: store._id,
        role: 'superadmin',
      }).exec()

      if (!profile) {
        const newProfile = new Profile({
          user: user._id,
          store: store._id,
          role: 'superadmin',
        })
        await newProfile.save()
        await User.updateOne(
          { _id: user._id },
          { $addToSet: { profiles: newProfile._id } }
        ).exec()
      }
    }
  }
}
