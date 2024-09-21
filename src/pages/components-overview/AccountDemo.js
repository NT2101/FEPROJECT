/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { accountApi } from '../../api/accountApi';

AccountDemo.propTypes = {

};

function AccountDemo(props) {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        (async () => {
            const objApi = accountApi;
            // Lay tong so ban ghi
            const lstUser = await objApi.getAll();
            setUsers(lstUser.data);
        })()
    }, [])
    // console.log('users:', users.data);
    // if(users != undefined){
    //    users.map(function(item){
    //     console.log(item.title);
    //    })
    // }
  

    return (
        <div>
            <p>Hello</p>
            <ul>
                {
                    users.map((item,idx) => (
                        <li key={item.id}>Title: {item.title}</li>
                    ))
                }
            </ul>
            {/* {                   
                users.map(function(item,idx){
                    <li key={idx}>{item.title}</li>
                })
            } */}
            
          
            {/* users != undefined && users != null && users != null && */}
            {/* users.map((user, idx) => (
                <li key={idx}>
                    {user.title}
                </li>
            )) */}
            {/* users.map(function(item){
                <li>{item.title}</li>
            }) */}
        </div>
    );
}

export default AccountDemo;