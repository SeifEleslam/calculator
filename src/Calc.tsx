/* eslint-disable no-new-func */
import React, { useState, useEffect } from "react";

export default function Calc() {
  const [state, setState] = useState<{
    digits: string[];
    ops: string[];
    results: number | undefined;
    curr: number;
    count: number;
    levelIndex: number[];
    percentLevel: number[]
  }>({
    digits: [""],
    ops: [""],
    results: 0,
    curr: 0,
    count: 0,
    levelIndex:[0],
    percentLevel: [],
  });
  const [view, setView] = useState({
    menu: false,
    show: true,
    note: false,
  });

  const [total, setTotal] = useState({
    showed: [""],
    hidden: [""],
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
    else if (val === "=") equal();
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
      levelIndex: [0],
      percentLevel:[]
    });
  };

  const addDigit = (val: string) => {
    let { digits, curr } = state;
    let str: string;
    digits[curr] !== undefined && digits[curr] !== ""
      ? (str = digits[curr].slice(-1))
      : (str = "");

    if (digits.length === 0 || digits[curr] === undefined) {
      digits.push(val);
    } else if (str.includes("%") || str.includes(")")) {
      addOp("×", val);
      return;
    } else {
      digits[curr] = digits[curr] + val;
    }

    setState((prev) => ({
      ...prev,
      digits: digits,
    }));
  };

  const addOp = (val: string, val2?: string) => {
    let { digits, ops, curr, count, levelIndex } = state;
    if (digits[curr] === "" || digits[curr] === undefined) {
      ops[curr - 1] = val;
    } else {
      ops[curr] = val;
      curr++;
      if (val2) {
        digits[curr] = val2;
        if (val2 === "(") {
          count++;
          levelIndex.push(curr);
        }
      }
    }
    setState((prev) => ({
      ...prev,
      ops,
      curr,
      count,
      levelIndex,
    }));
  };

  const changeSign = () => {
    let { digits, curr, count } = state;
    if (digits.length === 0 || digits[curr] === undefined) {
      digits[curr] = "(-";
    } else if (digits[curr].indexOf("(-") === -1) {
      digits[curr] = "(-" + digits[curr];
      count++;
    } else {
      digits[curr] = digits[curr].replace("(-", "");
      count--;
    }
    setState((prev) => ({
      ...prev,
      digits,
      count,
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
    let { digits, curr, count, levelIndex, percentLevel} = state;
    let str: string;
    digits[curr] !== undefined ? (str = digits[curr].slice(-1)) : (str = "");
    if (val === "()") {
      if (digits[curr] === "" || digits[curr] === undefined) {
        digits[curr] = "(";
        levelIndex.push(curr);
        count++;
      } else if (count > 0 && str !== "(") {
        digits[curr] += ")";
        levelIndex.pop();
        count--;
      } else if (
        str.includes("%") ||
        str.includes(")") ||
        !isNaN(Number(str))
      ) {
        addOp("×", "(");
        return;
      } else {
        digits[curr] += "(";
        levelIndex.push(curr);
        count++;
      }
    } else if (val === "%") {
      if(digits[curr] === "" || digits[curr] === undefined) invaildFormat()
      else if (digits[curr].indexOf("%") === -1 && !isNaN(Number(digits[curr][digits[curr].length - 1]))){
        digits[curr] += "%"
        percentLevel.push(levelIndex[levelIndex.length-1])
      }
    }

    setState((prev) => ({
      ...prev,
      digits,
      count,
      levelIndex,
    }));
  };

  function invaildFormat() {
    const ele = document.getElementById("notify");
    if (view.note === false) {
      ele!.innerHTML = "Invalid Format";
      ele!.classList.replace("-top-20", "top-0");
      setView((prev) => ({
        ...prev,
        note: true,
      }));
      setTimeout(() => {
        ele?.classList.replace("top-0", "-top-20");
        setView((prev) => ({
          ...prev,
          note: false,
        }));
      }, 2000);
    }
  }

  function maintainPercent() {
    let { digits, ops, percentLevel } = state;
    let l = 0;
    const maintained = digits.map((digit, i) => {
      if (digit.indexOf("%") !== -1) {
        if (
          ["+", "-"].indexOf(ops[i - 1]) + 1 &&
          ["+", "-", undefined].indexOf(ops[1]) + 1
        ) {
          l++
          return (
            digit.replace("%","") +
            "/100*" +
            doMath(
              digits.slice(percentLevel[l-1], i),
              ops.slice(percentLevel[l-1], i - 1),
              getCount(digits.slice(percentLevel[l-1], i))
            )
          );
        } else {
          l++
          return digit.slice(0, -1) + "/100";
        }
      } else {
        return digit;
      }
    });
    console.log(maintained);
    return maintained;
  }

  function getCount(arr:string[]) { 
    let count = 0;
    for(let i = 0; i < arr.length; i++){
      if(arr[i].indexOf("(") !== -1) count++;
      if(arr[i].indexOf(")") !== -1) count--;
    }
    return count
  }

  function doMath(digits: string[], ops: string[], count = state.count) {
    let total = [];
    for (let i = 0; i < digits.length; i++) {
      total.push(digits[i]);
      if (ops[i] !== undefined) {
        ops[i] !== "×"
          ? ops[i] !== "÷"
            ? total.push(ops[i])
            : total.push("/")
          : total.push("*");
      }
    }
    console.log(count)
    while (count > 0) {
      total[total.length - 1] += ")";
      count--;
    }
    console.log(total)
    try {
      return Number(Function(`return ${total.join("")}`)());
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
  function strip(number: number) {
    return parseFloat(number.toPrecision(12));
  }
  function equal() {
    let { results } = state;
    const maintained = maintainPercent();
    results = doMath(maintained, state.ops);
    if (results !== undefined) {
      setState((prev) => ({
        ...prev,
        results: strip(results!),
      }));
    }
    results !== undefined
      ? (document.getElementById("result")!.innerHTML =
          strip(results).toString())
      : invaildFormat();
  }

  useEffect(() => {
    console.log(state.digits);
    let total: string[] = [];
    for (let i = 0; i < state.digits.length; i++) {
      total.push(state.digits[i]);
      if (state.ops[i] !== undefined) {
        total.push(state.ops[i]);
      }
    }
    setTotal((prev) => ({
      ...prev,
      showed: total,
    }));
  }, [state]);

  useEffect(() => {
    if (total.showed.join("") === "")
      document.getElementById("input")!.innerHTML = "0";
    else document.getElementById("input")!.innerHTML = total.showed.join("");
  }, [total.showed]);

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
        className="overflow-hidden duration-200 w-96 left-2 mt-2 shadow-2xl fixed w-4/5 max-w-lg z-40"
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
      <p id="input" className="p-3 break-words">
        0
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
      className="p-2 shadow-xl font-bold duration-200 rounded-bl-sm rounded-br-sm bg-white text-sky-600 absolute -top-20 left-20"
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
    "w-1/4 h-10 text-sky-600 rounded-full duration-200 hover:bg-sky-600 hover:text-white active:bg-sky-600 active:text-white";
  const opClass =
    "w-1/4 h-10 text-gray-600 rounded-lg duration-200 hover:bg-sky-600 active:bg-sky-600";
  const clearClass =
    "w-1/4 h-10 text-red-600 rounded-lg duration-200 hover:bg-sky-600 active:bg-sky-600";

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
