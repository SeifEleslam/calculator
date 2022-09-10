import React, { useState } from "react";

export default function Calc() {
  const [state, setState] = useState({
    menu: false,
    show: true,
    digits: [""],
    ops: [""],
    spcials: [""],
    curr: 0,
    count: 0,
  });

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
    console.log("Cleared");
  };

  const addDigit = (val: string) => {
    let { digits, curr } = state;

    digits.length === 0 || digits[curr] === undefined
      ? digits.push(val)
      : (digits[curr] = digits[curr] + val);

    setState((prev) => ({
      ...prev,
      digits: digits,
    }));

    console.log(digits);
  };

  const addOp = (val: string, val2?: string) => {
    let { digits, ops, curr } = state;
    if (digits[curr] === "" || digits[curr] === undefined) {
      ops[curr - 1] = val;
    } else {
      ops[curr] = val;
      curr++;
      if (val2) digits[curr] = val2;
    }
    setState((prev) => ({
      ...prev,
      ops,
      curr,
    }));
    console.log(ops, digits);
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
    console.log(digits);
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
      } else if (digits[curr].match("%" || ")") || !isNaN(Number(str))) {
        addOp("×", "(");
        return;
      }
    } else if (val === "%") {
    }
    setState((prev) => ({
      ...prev,
      digits: digits,
      count: count,
    }));
    console.log(digits);
  };

  return (
    <div>
      <button
        id="toggleCalc"
        className="fixed z-50 mt-2 left-3 top-3 duration-200 p-3 rounded-full bg-sky-600"
        onClick={() => {
          const calc = document.getElementById("calc");
          const btn = document.getElementById("toggleCalc")

          if (calc && state.show === true) {
            calc.classList.replace("left-2", "-left-[600px]")
            if(btn) btn.classList.add("rotate-180")
            setState((prev)=>({
              ...prev,
              show:false
            }))
          }
          else if (calc && state.show === false){
            calc.classList.replace("-left-[600px]", "left-2")
            if(btn) btn.classList.remove("rotate-180")
            setState((prev)=>({
              ...prev,
              show:true
            }))
          }

        }}
      >
        <svg fill="#fff" width="30" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
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
