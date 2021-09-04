import React, { useState, useEffect } from 'react'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import { FeedsCollection } from '../../api/feeds'
import Feed from '../components/Feed'
import '../styles/homepage.css'
import { Container, InputGroup, FormControl, Button } from 'react-bootstrap'
import Navbar from '../components/TopNavBar'

export default function Home() {
    const [newFeed, setNewFeed] = useState('')
    const [displayFeeds, setDisplayFeeds] = useState(<div></div>)

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
                </InputGroup>
                {displayFeeds}
            </Container>
        </div>
    )
}
