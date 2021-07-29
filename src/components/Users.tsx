import React, { useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import axios from 'axios';
import Loader from "react-loader-spinner";
import 'semantic-ui-css/semantic.min.css'
import {Table } from 'semantic-ui-react'
import { Pagination } from 'semantic-ui-react'
import { Container } from 'semantic-ui-react'
import './Users.css'

interface User{
    name:String,
    email:String,
    phone_number:Number
}

function Users() {

    const[showUsers, setShowUsers] = React.useState(true);
    const[loading, setLoading] = React.useState(true);
    const[users, setUsers] = React.useState([]);
    const[totalCount, setTotalCount] = React.useState(0);
    const[startNumber, setStartNumber] = React.useState(1);
    const[userName,setUserName] = React.useState('');
    const[userEmail,setUserEmail] = React.useState('');
    const[userPhone,setUserPhone] = React.useState(0);

    useEffect( () => {
        setStartNumber(1)
        makeApiCall(true,0);
    },[])

    const makeApiCall = async (updateCount:boolean=false, startNumber:number) => {
        setLoading(true);
        const result = await axios.get(`https://nodetypepoc.herokuapp.com/users?start=${startNumber}&end=${(startNumber+5)}`);
        setUsers([]);
        setUsers(result.data.data.users);
        if(updateCount){
            setTotalCount(Math.ceil(result.data.data.count/5))
        }
        setLoading(false);
    }

    const updateVisibality = (value:boolean) => {
        setShowUsers(value)
    }

    const updateUsersList = (e:any) => {
        if(!isNaN(e.target.innerText)){
            let startNumber = e.target.innerText - 1;
            setStartNumber(startNumber+1);
            makeApiCall(false,startNumber*5);
        }
    }

    const addUser = async () => {
        if(!userName || !userPhone || !userEmail){
            alert('All the fields are mandatory');
        }else{
            const result = await axios.post('http://nodetypepoc.herokuapp.com/users', {
                "name": userName,
                "email": userEmail,
                "phone_number": userPhone,
            })
            if(result){
                alert('User added succesfully');
                setUserName('')
                setUserEmail('')
                setUserPhone(0)
                setShowUsers(true);
                makeApiCall(true,0);
            }
        }
    }

    const onUserNameChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setUserName(event.target.value);
    }

    const onUserEmailChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setUserEmail(event.target.value)
    }

    const onUserPhoneChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setUserPhone(Number(event.target.value))
    }

    const printCells = (records:any) => {
        return(
            <Table.Body>
                {
                    records.map( (record:User,index:any) => {
                        return(
                            <Table.Row key={index}>
                                <Table.Cell>{record.name}</Table.Cell>
                                <Table.Cell>{record.email}</Table.Cell>
                                <Table.Cell>{record.phone_number}</Table.Cell>
                            </Table.Row>
                        )
                    })
                }
            </Table.Body>
        )
    }

    return(
        <React.Fragment>
            <div>
                <div>
                    <Container style={{'margin-top':'50px'}}>
                        <Button primary onClick={() =>{updateVisibality(true)}}>Users List</Button>
                        <Button secondary onClick={() =>{updateVisibality(false)}} >Add User</Button>
                    </Container>
                    {
                        loading ? (
                            <Container style={{'margin-top':'100px'}}>
                                <Loader
                                    type="Puff"
                                    color="#00BFFF"
                                    height={100}
                                    width={100}
                                />
                            </Container>
                        ):
                        (showUsers && users && !loading) ? (
                            <Container style={{'margin-top':'50px'}}>
                                <Table celled>
                                    <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Name</Table.HeaderCell>
                                        <Table.HeaderCell>Email</Table.HeaderCell>
                                        <Table.HeaderCell>Phone</Table.HeaderCell>
                                    </Table.Row>
                                    </Table.Header>

                                    {   
                                            printCells(users)
                                    }
                                </Table>
                                <Pagination
                                    boundaryRange={0}
                                    defaultActivePage={startNumber}
                                    ellipsisItem={null}
                                    firstItem={null}
                                    lastItem={null}
                                    siblingRange={1}
                                    totalPages={totalCount}
                                    onClick={(e:any) =>updateUsersList(e)}
                                />
                            </Container>
                        ):(
                            <div>
                                <Container style={{'margin-top':'50px'}}>
                                    <div className="input-list">
                                        <div>
                                            <button className="ui button" disabled>User Name</button>
                                            <div className="ui input">
                                                <input type="text" 
                                                    placeholder="User Name..."
                                                    onChange={onUserNameChange}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <button className="ui button" disabled>Email</button>
                                            <div className="ui input">
                                                <input type="text" 
                                                placeholder="Enter Email..."
                                                onChange={onUserEmailChange}
                                            />
                                            </div>
                                        </div>
                                        <div>
                                            <button className="ui button" disabled>Phone Number</button>
                                            <div className="ui input">
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter Phone..."
                                                    onChange={onUserPhoneChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-submit">
                                        <Button primary onClick={() =>addUser()}>Add User</Button>
                                    </div>
                                </Container>
                            </div>
                        )
                    }
                </div>
            </div>
        </React.Fragment>
    )
}
export default Users;
