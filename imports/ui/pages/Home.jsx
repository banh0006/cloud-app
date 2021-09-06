import React, { useState, useEffect } from 'react'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'

import { FeedsCollection } from '../../api/feeds'
import Feed from '../components/Feed'
import UploadModal from '../components/UploadModal'

import '../styles/homepage.css'
import { Container, InputGroup, FormControl, Button } from 'react-bootstrap'
import Navbar from '../components/TopNavBar'

export default function Home() {
    const [newFeed, setNewFeed] = useState('')
    const [displayFeeds, setDisplayFeeds] = useState(<div></div>)
    const [showUploadModal, setShowUploadModal] = useState(false)

    const allFeeds = useTracker(() => {
        Meteor.subscribe('getAllFeeds')
        return FeedsCollection.find({}, {sort: {createdAt: -1}}).fetch()
    })

    const createFeed = e => {
        e.preventDefault()
        const userId = Meteor.userId()

        if (newFeed.length > 0) {
            FeedsCollection.insert({ 
                userId: userId, 
                createdAt: Date.now(), 
                updatedAt: Date.now(), 
                type: "Text",
                feedContent: newFeed
            }, function(err, result) {
                if (err) {
                    alert("Something went wrong, please create you feed again!")
                } else {
                    alert("Successfully added your new feed")
                }
            })
        }
        setNewFeed('')
    }

    useEffect(() => {
        if (allFeeds.length > 0) {
            const displayFeeds = allFeeds.map(feed => (
                <Feed key={feed._id} feed={feed} />
            ))

            setDisplayFeeds(displayFeeds)
        }
    }, [allFeeds.length])

    return (
        <div className="page-wrapper">
            <Container className="home-container">
                <Navbar email={Meteor.user().emails[0].address}/>
                <h1 className="page-title"> Explore #somethinggood </h1>
                <InputGroup className="mb-3">
                    <FormControl
                        className="feed-input"
                        placeholder="Create your new feed"
                        value={newFeed}
                        onChange={e => setNewFeed(e.target.value)}
                    />
                    <Button variant="success" onClick={createFeed}>
                        Create
                    </Button>
                    
                    <Button variant="info" onClick={e => setShowUploadModal(true)}>
                        Upload Image
                    </Button>
                </InputGroup>
                {displayFeeds}
                <div>
                    <UploadModal show={showUploadModal} setShow={setShowUploadModal} />
                </div>
            </Container>
        </div>
    )
}