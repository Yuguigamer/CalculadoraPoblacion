import {View, Text, StyleSheet,FlatList,Image } from 'react-native';
import axios from 'axios';
import React, { useState, useEffect } from 'react'; 
import supabaseApi from '../api/supabase';

const url = 'https://owoautqtvrpsfssawbck.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93b2F1dHF0dnJwc2Zzc2F3YmNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MjY5NTQsImV4cCI6MjA1ODUwMjk1NH0.mTiTUktJICxFjOemW2k_r3GaS-hK3Md8mJrbz7YS3po';
const table = 'clientes';

const superbaseDAPI = axios.create(
    {
        baseURL: `${url}/rest/v1`,
        headers:{
            'apikey' :key,
            'Authorization':`Bearer $P{key}`,
            'Content-Type':'application/json'
        }
    }
);

export default function Humano(): JSX.Element{
    const [clientes,setClientes] = useState<string[]>([]);
    useEffect(()=>{
        const APIClients= async()=>{
            const response = await superbaseDAPI.get(`/${table}?select=*`);
            setClientes(response.data);
        }
            
    });
    return(
        <View style={estilos.container}>
            <Text style={estilos.text}> Listado de clientes</Text>
            <FlatList
                data={clientes}
                renderItem={({item})=>(
                    <Text>{item.nombre}</Text>
                )}
            />
        </View>
    );
}
 const estilos = StyleSheet.create({
    container:{
        padding:10,
        backgroundColor:"#f0f0f0",
    },
    text:{
        fontSize:20,
        color:"black",
    },
    item:{
        fontSize:19,
        padding:6,
        borderBottomWidth:2,
        borderRightWidth:2,
        borderBottomColor:"#898930",
        borderRightColor:"#898930"

    },
    imagen:{
        width:120,
        height:120,
        marginBottom:10
    }
});