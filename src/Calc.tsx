/* eslint-disable no-new-func */
import React, { useState, useEffect } from "react";

export default function Calc() {
  const [state, setState] = useState<{
    digits: string[];
    ops: string[];
    results: number | undefined;
    curr: number;
    count: number;
  }>({
    digits: [""],
    ops: [""],
    results: 0,
    curr: 0,
    count: 0,
  });
  const [view, setView] = useState({
    menu: false,
    show: true,
  });

  const [total, setTotal] = useState({
    showed:[""],
    hidden:[""]
  })
  const IDs = [
    "C",
    "()",
    "%",
    "÷",
    "7",
    "8",
    "9",
    "×",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "+",
    "+/-",
    "0",
    ".",
    "=",
  ];

  const maintainClick = (val: string) => {
    if (val === "C") clear();
    else if (!isNaN(Number(val))) addDigit(val);
    else if (val === "+/-") changeSign();
    else if (val === ".") addDot();
    else if (val === "()") addSpcial("()");
    else if (val === "%") addSpcial("%");
    else addOp(val);
    /*else if (val === "()")            addSpcial("()")
        else if (val === "%")               addSpcial("%")
        else if (val === "+/-")             changeSign()
        else if (val === ".")               addDot()
        else if (val === "=")               showResults()
        else if (!isNaN(Number(val)))       addDigit(val)
        else                                addOp(val)*/
  };

  const clear = () => {
    setState({
      digits: [""],
      ops: [""],
      results: 0,
      curr: 0,
      count: 0,
    });
  };

  const addDigit = (val: string) => {
    let { digits, curr } = state;
    let str:string;
    digits[curr] !== undefined && digits[curr] !== "" ? (str = digits[curr].slice(-1)) : (str = "");


    if(digits.length === 0 || digits[curr] === undefined){
      digits.push(val)
    }
    else if (str.includes("%"||")")){
      addOp("×", val)
      return
    }
    else{
      digits[curr] = digits[curr] + val
    }

    setState((prev) => ({
      ...prev,
      digits: digits,
    }));
  };

  const addOp = (val: string, val2?: string) => {
    let { digits, ops, curr, count } = state;
    if (digits[curr] === "" || digits[curr] === undefined) {
      ops[curr - 1] = val;
    } else {
      ops[curr] = val;
      curr++;
      if (val2) {
        digits[curr] = val2;
        if(val2 === "(") count++
      }
    }
    setState((prev) => ({
      ...prev,
      ops,
      curr,
      count,
    }));
  };

  const changeSign = () => {
    let { digits, curr } = state;
    if (digits.length === 0 || digits[curr] === undefined) {
      digits[curr] = "(-";
    } else if (digits[curr].indexOf("(-") === -1) {
      digits[curr] = "(-" + digits[curr];
    } else {
      digits[curr] = digits[curr].replace("(-", "");
    }
    setState((prev) => ({
      ...prev,
      digits: digits,
    }));
  };

  const addDot = () => {
    let { digits, curr } = state;
    digits[curr] === "" || digits[curr] === undefined
      ? (digits[curr] = "0.")
      : digits[curr].indexOf(".") === -1
      ? (digits[curr] += ".")
      : console.log("dotted");
    setState((prev) => ({
      ...prev,
      digits: digits,
    }));
  };

  const addSpcial: Function = (val: string) => {
    let { digits, curr, count } = state;
    let str: string;
    digits[curr] !== undefined ? (str = digits[curr].slice(-1)) : (str = "");
    if (val === "()") {
      if (digits[curr] === "" || digits[curr] === undefined) {
        digits[curr] = "(";
        count++;
      } else if (count > 0 && str !== "(") {
        digits[curr] += ")";
        count--;
      } else if (digits[curr].includes("%" || ")") || !isNaN(Number(str))) {
        addOp("×", "(");
        return;
      }
    } else if (val === "%") {
      digits[curr] === "" || digits[curr] === undefined
        ? invaildFormat()
        : digits[curr].indexOf("%") === -1 && !isNaN(Number(digits[curr][digits[curr].length-1]))
        ? (digits[curr] += "%")
        : console.log("%ed");
    }

    function invaildFormat() {}

    setState((prev) => ({
      ...prev,
      digits: digits,
      count: count,
    }));
  };

  function maintainPercent() {
    let { digits, ops } = state;
    digits.forEach((digit, i) => {
      if (digit.indexOf("%") !== -1) {
        if (
          ops[i - 1].match("+" || "-" || undefined) &&
          ops[i].match("+" || "-" || undefined)
        ) {
          digit =
            digit.slice(0, digit.indexOf("%")) +
            "/100*" +
            doMath(
              digits.splice(i, digits.length - i + 1),
              ops.splice(i - 1, ops.length - i + 2)
            );
        }
      } else {
        digit = digit.slice(0, digit.indexOf("%")) + "/100";
      }
    });
    return digits;
  }

  function doMath(digits: string[], ops: string[]) {
    let total = []
    for (let i = 0; i < digits.length; i++) {
      total.push(digits[i]);
      if (ops[i] !== undefined) {
        ops[i] !== "×" ? total.push(ops[i]) : total.push("*");
      }
    }
    try {
      return Number(Function(`return ${total.join()}`));
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  function equal() {
    const maintained = maintainPercent();
    const results = doMath(maintained, state.ops);
    setState((prev) => ({
      ...prev,
      results: results,
    }));
    results !== undefined
      ? (document.getElementById("result")!.innerHTML = results.toString())
      : (document.getElementById("result")!.innerHTML = "0");
  }

  useEffect(()=>{
    let total:string[] = [];
    for (let i = 0; i < state.digits.length; i++) {
      total.push(state.digits[i]);
      if (state.ops[i] !== undefined) {
        total.push(state.ops[i]);
      }
    }
    if (state.digits[state.curr] !== undefined) console.log(state.digits[state.curr].includes(")"||"%"))
    console.log(state)
    setTotal((prev)=>({
      ...prev,
      showed:total,
    }))
  },[state])

  useEffect(()=>{
    document.getElementById("input")!.innerHTML = total.showed.join("")
  },[total.showed])

  return (
    <div>
      <button
        id="toggleCalc"
        className="fixed z-50 mt-2 left-3 top-3 duration-200 p-3 rounded-full bg-sky-600"
        onClick={() => {
          const calc = document.getElementById("calc");
          const btn = document.getElementById("toggleCalc");

          if (calc && view.show === true) {
            calc.classList.replace("left-2", "-left-[600px]");
            if (btn) btn.classList.add("rotate-180");
            setView((prev) => ({
              ...prev,
              show: false,
            }));
          } else if (calc && view.show === false) {
            calc.classList.replace("-left-[600px]", "left-2");
            if (btn) btn.classList.remove("rotate-180");
            setView((prev) => ({
              ...prev,
              show: true,
            }));
          }
        }}
      >
        <svg
          fill="#fff"
          width="30"
          height="30"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256S114.6 512 256 512s256-114.6 256-256zM103 239L215 127l17-17L265.9 144l-17 17-71 71L392 232l24 0 0 48-24 0-214.1 0 71 71 17 17L232 401.9l-17-17L103 273l-17-17 17-17z" />
        </svg>
      </button>
      <div
        id="calc"
        className="duration-200 w-96 left-2 mt-2 shadow-2xl fixed w-4/5 max-w-lg z-40"
      >
        <Screen />
        <Buttons ids={IDs} click={maintainClick} />
      </div>
    </div>
  );
}

const Screen = () => {
  return (
    <div className="align-center w-full bg-sky-600 p-10 rounded-tl rounded-tr">
      <Notify />
      <p id="input" className="p-3">
        1/0
      </p>
      <h2 id="result" className="text-2xl p-3">
        {" "}
        infinity
      </h2>
    </div>
  );
};

const Notify = () => {
  return (
    <p
      id="notify"
      className="p-2 shadow-xl font-bold duration-200 rounded-bl-sm rounded-br-sm bg-white text-sky-600 absolute top-0 left-20"
    ></p>
  );
};
interface Props {
  ids: string[];
  click: (id: string) => void;
}

const Buttons = (props: Props) => {
  const { ids, click } = props;
  const digitClass =
    "w-1/4 h-10 text-sky-600 rounded-full duration-200 hover:bg-sky-600 hover:text-white";
  const opClass =
    "w-1/4 h-10 text-gray-600 rounded-lg duration-200 hover:bg-sky-600 active:bg-gray-400";
  const clearClass =
    "w-1/4 h-10 text-red-600 rounded-lg duration-200 hover:bg-sky-600 active:bg-gray-400";

  return (
    <div
      id="buttons"
      className="overflow-auto bg-gray-100 flex-auto rounded-bl rounded-br py-2"
    >
      {ids.map((id) => (
        <button
          key={id}
          className={
            id === "C" ? clearClass : !isNaN(Number(id)) ? digitClass : opClass
          }
          onClick={() => {
            click(id);
          }}
        >
          {id}
        </button>
      ))}
    </div>
  );
};
