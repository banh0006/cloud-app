import React from 'react'
import '../styles/comment.css'

export default function Comment({ userEmail, comment }) {
    return (
        <div className="comment-wrapper">
            <div className="comment">
                <span className="comment-owner">{`${userEmail}: `}</span>
                <span className="comment-body">{comment}</span>
            </div>
        </div>
    )
}
