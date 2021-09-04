import React, { useState, useEffect } from 'react'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import { CommentsCollection } from '../../api/comments'
import Comment from './Comment'

import '../styles/feed.css'
import { Card } from 'react-bootstrap'

export default function Feed({ feed }) {
    const [newComment, setNewComment] = useState('')
    const [feedOwner, setFeedOwner] = useState('')
    const [displayComments, setDisplayComments] = useState(<div></div>)

    //get all comment of the feed
    const allComments = useTracker(() => {
        Meteor.subscribe('getCommentOnFeed', { feedId: feed._id })
        return CommentsCollection.find({ feedId: feed._id }, {sort: {createdAt: 1}}).fetch()
    })

    const onKeyDown = e => {
        if (e.key === 'Enter') {
            const value = e.target.value
            if (value.length > 0) {
                CommentsCollection.insert({ 
                    owner: Meteor.user().emails[0].address, 
                    feedId: feed._id,
                    createdAt: Date.now(), 
                    updatedAt: Date.now(), 
                    content: value
                }, function(err, result) {
                    if (err) {
                        console.log(err)
                        alert("Something went wrong, please try again!")
                    }
                })

                setNewComment('')
            }
        }
    }

    useEffect(() => {
        Meteor.call('getUserEmailById', feed.userId, function(err, result) {
            if (err) {
                console.log("user not found")
            } else {
                setFeedOwner(result)
            }
        })
    }, [])

    useEffect(() => {
        if (allComments.length > 0) {
            const displayComment = allComments.map(comment => {
                return (<Comment key={comment._id} userEmail={comment.owner} comment={comment.content}  />)
            })

            setDisplayComments(displayComment)
        }
    }, [allComments.length])

    return (
        <Card className="feed-card">
            <div className="comment-box">
                <input 
                    type="text" 
                    value={newComment} 
                    placeholder="Write comment for the feed below ..."
                    onChange={e => setNewComment(e.target.value)} 
                    onKeyDown={onKeyDown} 
                />
            </div>
            <hr />
            <div className="feed-content-wrapper">
                <div className="feed-content">
                    <div className="content">{feed.feedContent}</div>
                    <div className="author">Created by <span className="feed-owner">{feedOwner}</span></div>
                </div>
            </div>
            <hr />
            <div className="feed-comments">
                {displayComments}
            </div>
        </Card>
    )
}