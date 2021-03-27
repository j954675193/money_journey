import { useState, useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { BsPlus, BsTrash, BsPencil } from "react-icons/bs";
import { useForm } from "react-hook-form"

// Firebase
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

if (firebase.apps.length === 0) {
  firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseUrl: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
  })
}
const firestore = firebase.firestore()
const auth = firebase.auth()

export default function Category() {
  const [records, setRecords] = useState([])
  const { register, handleSubmit } = useForm()
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [tempData, setTempData] = useState({
    id: null,
    cateID: 0,
    name: 'uncategoriesed',
  })

  // Firebase stuff
  const cateRef = firestore.collection('category');
  const moneyRef = firestore.collection('money')
  const query = cateRef.orderBy('cateID');

  const [data] = useCollectionData(query, { idField: 'id' });
  const [mj] = useCollectionData(moneyRef, { idField: 'id' });
  // console.log(mj.length)
  // const l = mj.length

  useEffect(() => {
    if (data) { // Guard condition
      let r = data.map((d, i) => {
        return (
          <CategoryRow
            data={d}
            i={i}
            onDeleteClick={handleDeleteClick}
            onEditClick={handleEditClick}
          />
        )
      })

      setRecords(r)
    }
  },
    [data])

  // Handlers for Modal Add Form
  const handleshowForm = () => setShowForm(true)

  // Handlers for Modal Add Form
  const handleCloseForm = () => {
    setTempData({
      id: null,
      cateID: 0,
      description: 'uncategoriesed',
    })

    setShowForm(false)
    setEditMode(false)

  }

  const onSubmit = async (data) => {
    let preparedData = {
      // ...data,
      cateID: data.cateID,
      name: data.name,
    }
    console.log('onSubmit', preparedData)

    if (editMode) {
      // Update record
      console.log("UPDATING!!!!", data.id)
      await cateRef.doc(data.id)
        .set(preparedData)
        .then(() => console.log("moneyRef has been set"))
        .catch((error) => {
          console.error("Error: ", error);
          alert(error)
        });
    } else {
      // Add to firebase
      // This is asynchronous operation, 
      // JS will continue process later, so we can set "callback" function
      // so the callback functions will be called when firebase finishes.
      // Usually, the function is called "then / error / catch".
      await cateRef
        .add(preparedData)
        .then(() => console.log("New record has been added."))
        .catch((error) => {
          console.error("Errror:", error)
          alert(error)
        })
      // setShowForm(false)
    }
    handleCloseForm()
  }

  const handleDeleteClick = (id) => {
    console.log('handleDeleteClick in Journal', id)
    if (window.confirm("Are you sure to delete this record?"))
      cateRef.doc(id).delete()
    // console.log('cateid',cateID)

    // var item 
    // for(item in mj){
    //   console.log(item.category.id)
    //   if (item.category.id === id){
    //     moneyRef.doc(item.id).set({category:{id:0, name:'uncategorised'}})
    //   }
    // }


  }

  const handleEditClick = (data) => {
    let preparedData = {
      id: data.id,
      cateID: data.cateID,
      name: data.name
    }
    console.log("handleEditClick", preparedData)
    // expect original data type for data.createdAt is Firebase's timestamp
    // convert to JS Date object and put it to the same field
    // if ('toDate' in data.createdAt) // guard, check wther toDate() is available in createdAt object.
    //   data.createdAt = data.createdAt.toDate()

    setTempData(preparedData)
    setShowForm(true)
    setEditMode(true)
  }

  return (
    <Container>
      <h1>Category Management</h1>
      <Button variant="outline-dark" onClick={handleshowForm}>
        <BsPlus /> Add
      </Button>


      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {records}
        </tbody>
      </Table>


      <Modal
        show={showForm} onHide={handleCloseForm}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="hidden"
            placeholder="ID"
            ref={register}
            name="id"
            id="id"
            defaultValue={tempData.id}
          />
          <Modal.Header closeButton>
            <Modal.Title>
              Add
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col>
                <label htmlFor="cateID">ID</label>
              </Col>
              <Col>
                <input
                  type="number"
                  step="any"
                  // min="0"
                  placeholder="ID"
                  ref={register({ required: true })}
                  name="cateID"
                  id="cateID"
                  defaultValue={tempData.cateID}
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <label htmlFor="name">Name</label>
              </Col>
              <Col>
                <input
                  type="text"
                  placeholder="Name"
                  ref={register({ required: true })}
                  name="name"
                  id="name"
                  defaultValue={tempData.name}
                />
              </Col>
            </Row>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseForm}>
              Close
          </Button>
            <Button variant="primary" type="submit">
              Add Record
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </Container>
  )
}

function CategoryRow(props) {
  let d = props.data
  let i = props.i

  return (
    <tr>
      <td>
        <BsTrash onClick={() => props.onDeleteClick(d.id)} />
        <BsPencil onClick={() => props.onEditClick(d)} />
      </td>
      <td>{d.cateID}</td>
      <td>{d.name}</td>
    </tr>
  )
}