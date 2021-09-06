import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { FeedsCollection } from '/imports/api/feeds'
import { CommentsCollection } from '/imports/api/comments'
import './imports/Server-side-file-store'

// set up first default user to login
const SEED_USEREMAIL = 'phucthien@gmail.com'
const SEED_PASSWORD = '123'

Meteor.publish('getCommentOnFeed', ({ feedId }) => {
  return CommentsCollection.find({ feedId })
})

Meteor.publish('getAllFeeds', () => {
  return FeedsCollection.find()
})
 
Meteor.methods({
  getUserEmailById: function(id) {
    const userFound = Meteor.users.findOne({_id: id})
    return userFound.emails[0].address
  },
})

Meteor.startup(() => {  
  // set up testing user account
  if (!Accounts.findUserByEmail(SEED_USEREMAIL)) {
    Accounts.createUser({
      email: SEED_USEREMAIL,
      password: SEED_PASSWORD,
    })
  }
})
