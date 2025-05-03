const User = require('../../models/user')
const Store = require('../../models/store')
const Profile = require('../../models/profile')
const Location = require('../../models/location')
const { checkPermissions } = require('../../utils/auth')

module.exports = async (ctx) => {
  await checkPermissions(ctx, ['authenticated'])

  return {
    ...(
      await User.findById(ctx.auth.user._id)
        .populate({
          path: 'profiles',
          select: Profile.publicFields(),
          populate: [
            {
              path: 'store',
              select: Store.publicFields(),
              populate: {
                path: 'location',
                select: Location.publicFields(),
              },
            },
          ],
        })
        .select(User.publicFields())
        .exec()
    ).toJSON(),
    token: await ctx.auth.user.generateJwtToken(false),
  }
}
