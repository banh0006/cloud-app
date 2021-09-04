import React, { useState, useRef } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import PropTypes from 'prop-types'

import ImagesCollection from '../../api/images'

function ImageUpload() {
  const [uploading, setUploading] = useState([])
  const [progress, setProgress] = useState(0)
  const [inProgress, setInProgress] = useState(false)
  const fileinput = useRef()
  const uploadIt = (e) => {
    e.preventDefault()

    let self = this

    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // there was multiple files selected
      var file = e.currentTarget.files[0]

      console.log(file)

      if (file) {
        // Meteor.call('insertImage', file, function(err, result) {
        //   if (err) {
        //     console.log(err)
        //   } else {
        //     alert(result)
        //   }
        // })
        
        console.log("before save image")
        let uploadInstance = ImagesCollection.insert({
          file: file,
          meta: {
            userId: Meteor.userId() // Optional, used to check on server for file tampering
          },
          chunkSize: 'dynamic',
          allowWebWorkers: true // If you see issues with uploads, change this to false
        }, false)


        setUploading(uploadInstance)// Keep track of this instance to use below
        setInProgress(true)// Show the progress bar now

        // These are the event functions, don't need most of them, it shows where we are in the process
        uploadInstance.on('start', function () {
          console.log('Starting')
        })

        uploadInstance.on('end', function (error, fileObj) {
          console.log('On end File Object: ', fileObj)
        })

        uploadInstance.on('uploaded', function (error, fileObj) {
          console.log('uploaded: ', fileObj)

          // Remove the filename from the upload box
          fileinput.value = ''

          // Reset our state for the next file
          setUploading([])
          setProgress(0)
          setInProgress(false)
        })

        uploadInstance.on('error', function (error, fileObj) {
          console.log('Error during upload: ' + error)
        })

        uploadInstance.on('progress', function (progress, fileObj) {
          console.log('Upload Percentage: ' + progress)
          // Update our progress bar
          setProgress(progress)
        })

        uploadInstance.start() // Must manually start the upload
      }
    }
  }

  return (
    <div>
        <div className="row">
          <div className="col-md-12">
            <p>Upload New File:</p>
            <input type="file" id="fileinput" disabled={inProgress} ref={fileinput}
                 onChange={uploadIt}/>
          </div>
        </div>

        <div className="row m-t-sm m-b-sm">
          <div className="col-md-6">
          </div>
          <div className="col-md-6">
          </div>
        </div>
      </div>
  )
}

export default withTracker( ( props ) => {
  const filesHandle = Meteor.subscribe('files.all')
  const docsReadyYet = filesHandle.ready()
  // const files = ImageUpload.find({}, {sort: {name: 1}}).fetch()

  return {
    docsReadyYet,
  }
})(ImageUpload)