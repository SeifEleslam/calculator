import React, { useState } from "react";


export default function Calc () {
    const [state, setState] = useState({
        menu: false,
        digits:[""],
        ops:[""],
        spcials:[""],
        curr:0,
        count:0
        
    })


    const IDs = [
        "C", "()", "%", "÷",
        "7", "8", "9", "×",
        "4", "5", "6", "-",
        "1", "2", "3", "+",
        "+/-", "0", ".", "="
    ]
    

    const maintainClick = (val:string) =>{
        if (val === "C")                     clear()
        else if (!isNaN(Number(val)))       addDigit(val)
        else if (val === "+/-")             changeSign()
        else if (val === ".")               addDot()
        else if (val === "()")            addSpcial("()")
        else                                addOp(val)
        /*else if (val === "()")            addSpcial("()")
        else if (val === "%")               addSpcial("%")
        else if (val === "+/-")             changeSign()
        else if (val === ".")               addDot()
        else if (val === "=")               showResults()
        else if (!isNaN(Number(val)))       addDigit(val)
        else                                addOp(val)*/
    }

    const clear = () => {
        console.log("Cleared")
    }
     
    const addDigit = (val:string) => {
        let {digits, curr} = state

        digits.length === 0 || digits[curr] === undefined? digits.push(val) : digits[curr] = digits[curr]+val

        setState((prev)=>({
            ...prev,
            digits : digits
        }))

        console.log(digits)

    }

    const addOp = (val:string) =>{
        let {digits, ops, curr} = state
        if(digits[curr] === "" || digits[curr] === undefined ) {
            ops[curr-1] = val
        }
        else{
            ops[curr]=val;
            curr++;
        }
        setState((prev)=>({
            ...prev,
            ops:ops,
            curr:curr
        }))
        console.log(ops)
    }

    const changeSign = () => {
        let {digits, curr} = state
        if(digits.length === 0 || digits[curr] === undefined){
            digits[curr] = "(-"
        }
        else if (digits[curr].indexOf("(-") === -1 ){
            digits[curr] = "(-" + digits[curr]
        }
        else{
            digits[curr] = digits[curr].replace("(-","")
        }
        setState((prev)=>({
            ...prev,
            digits:digits,
        }))
        console.log(digits)
    }

    const addDot = () => {
        let {digits, curr} = state
        digits[curr] === "" || digits[curr] === undefined ? digits[curr] = "0." : digits[curr].indexOf(".") === -1? digits[curr] += "." : console.log("dotted");
        setState((prev)=>({
            ...prev,
            digits:digits,
        }))
    }

    const addSpcial = (val:string) => {
        let {digits, curr, count} = state
        let str:string;
        digits[curr] !== undefined? str = digits[curr].slice(-1): str =""
        if(val === '()'){
            if(digits[curr] === "" || digits[curr] === undefined){
                digits[curr] = "("
                count ++
            }
            else if(count > 0 && str !== "("){
                digits[curr] += ")"
                count --
            }
            else if(digits[curr].match("%"||")") || !isNaN(Number(str))){
                addOp("×")
                addSpcial("()")
            }
            
        }
        setState((prev)=>({
            ...prev,
            digits:digits,
            count:count
        }))
        console.log(digits)

    }



    
    return(
        <div className="font-Audiowide container w-96 mx-auto mt-10 shadow-2xl">
            <Screen />
            <Buttons ids = {IDs} click = {maintainClick}/>
        </div>
    )
    
}

const Screen =  () => {
    return(
        <div className="w-full bg-sky-600 p-10 rounded-tl rounded-tr">
            <p id="input" className="p-3">1/0</p>
            <h2 id="result" className="text-2xl p-3"> infinity</h2>
        </div>
    )
}

interface Props {
    ids: string[];
    click:(id:string) => void;
    
}

const Buttons = (props:Props) => {
    const {ids, click} = props
    const digitClass = "w-1/4 h-24 text-sky-600"
    const opClass = "w-1/4 h-24 text-gray-600"
    const clearClass = "w-1/4 h-24 text-red-600 "
    
    return(
        <div id = "buttons" className="w-full bg-gray-100 flex-auto rounded-bl rounded-br">
            {
                ids.map(
                    id => (
                        
                        <button key = {id} className={
                            id ==="C"? clearClass: !isNaN(Number(id))? digitClass: opClass
                        }
                        onClick = {() => {
                            click( id)
                        }} 
                        >{id}</button>
                    )
                )   
            }
        </div>
    )

}