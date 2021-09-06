import React from 'react'
import { Modal, ModalTitle, ModalBody } from 'react-bootstrap'
import ImageUpload from './ImageUpload'
import '../styles/uploadmodal.css'

export default function UploadModal({ show, setShow }) {
    const handleClose = () => setShow(false)

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <ModalTitle>Upload Image</ModalTitle>
            </Modal.Header>
            <ModalBody>
                <ImageUpload closeModal={handleClose} />
            </ModalBody>
        </Modal>
    )
}
