import React, { useState, useRef } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import ImagesCollection from '../../api/images'

function ImageUpload({ closeModal }) {
  const [inProgress, setInProgress] = useState(false)
  const fileinput = useRef()
  const uploadIt = (e) => {
    e.preventDefault()

    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // there was multiple files selected
      var file = e.currentTarget.files[0]
      if (file) {
        let uploadInstance = ImagesCollection.insert({
          file: file,
          meta: {
            userId: Meteor.userId(), // Optional, used to check on server for file tampering
            createdAt: Date.now()
          },
          chunkSize: 'dynamic',
          allowWebWorkers: true // If you see issues with uploads, change this to false
        }, false)

        setInProgress(true)
        uploadInstance.on('uploaded', function(error, fileObj) {
          if (error) {
            alert("Something went wrong during uploading Image. Please try again.")
          }
      
          setInProgress(false)
          alert("Successfully upload image and create new feed")
          closeModal()

          // Remove the filename from the upload box
          fileinput.value = ''
        })

        uploadInstance.on('error', function (error, fileObj) {
          alert('Error during upload: ' + error)
        })

        uploadInstance.start()
      }
    }
  }

  return (
    <div>
        <div className="row">
          <div className="col-md-12">
            <p>Upload new image to create new feed:</p>
            <input type="file" id="fileinput" accept="image/png, image/gif, image/jpeg" disabled={inProgress} ref={fileinput}
                 onChange={uploadIt}/>
          </div>
        </div>
      </div>
  )
}

export default withTracker( ( props ) => {
  const filesHandle = Meteor.subscribe('files.all')
  const docsReadyYet = filesHandle.ready()
  const files = ImagesCollection.find({}, {sort: {name: 1}}).fetch()

  return {
    docsReadyYet,
  }
})(ImageUpload)