/* eslint-disable no-new-func */
import React, { useState, useEffect } from "react";
import { VscHistory } from "react-icons/vsc";
import { BsFillReplyFill } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { add, clear, selectHist, state } from "./features/history/histSlice";

export default function Calc() {
  const dispatch = useDispatch();

  const [results, setResults] = useState<number | undefined>(0);

  const [state, setState] = useState<state>({
    digits: [""],
    ops: [""],
    curr: 0,
    count: 0,
    startLevelIndex: [0],
    endLevelIndex: [],
    percentLevel: [],
  });
  const [view, setView] = useState({
    menu: false,
    show: true,
    note: false,
  });

  const [total, setTotal] = useState({
    showed: [""],
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
    else if (val === "history") toggleHistory();
    else if (val === "backspace") backspace();
    else if (val === "=") equal("=");
    else if (!isNaN(Number(val))) addDigit(val);
    else if (val === "+/-") changeSign();
    else if (val === ".") addDot();
    else if (val === "()") addSpcial("()");
    else if (val === "%") addSpcial("%");
    else addOp(val);
  };

  const toggleHistory = () => {
    const hist = document.getElementById("hist");
    const btn = document.getElementById("toggleHist");

    if (hist && view.menu === true) {
      hist.classList.replace("-bottom-[0px]", "-bottom-[200px]");
      if (btn) btn.classList.remove("rotate-180");
      setView((prev) => ({
        ...prev,
        menu: false,
      }));
    } else if (hist && view.menu === false) {
      hist.classList.replace("-bottom-[200px]", "-bottom-[0px]");
      if (btn) btn.classList.add("rotate-180");
      setView((prev) => ({
        ...prev,
        menu: true,
      }));
    }
  };

  const backspace = () => {
    let {
      digits,
      ops,
      curr,
      startLevelIndex,
      endLevelIndex,
      percentLevel,
      count,
    } = state;
    const end = digits[curr]?.slice(-1) ?? "";
    if (end === "" && curr !== 0) {
      ops.pop();
      curr--;
    } else if (!isNaN(Number(end)) || end === "." || end === "-") {
      digits[curr] = digits[curr].slice(0, -1);
    } else if (end === "(") {
      digits[curr] = digits[curr].slice(0, -1);
      startLevelIndex.pop();
      count--;
    } else if (end === ")") {
      digits[curr] = digits[curr].slice(0, -1);
      endLevelIndex.pop();
      count++;
    } else if (end === "%") {
      digits[curr] = digits[curr].slice(0, -1);
      percentLevel.pop();
    }

    setState((prev) => ({
      ...prev,
      digits,
      ops,
      curr,
      startLevelIndex,
      endLevelIndex,
      percentLevel,
      count,
    }));
  };

  const loadHist = (val: state, val2: number) => {
    setState(JSON.parse(JSON.stringify(val)));
    setResults(val2);
  };

  const clear = () => {
    setState({
      digits: [""],
      ops: [""],
      curr: 0,
      count: 0,
      startLevelIndex: [0],
      endLevelIndex: [],
      percentLevel: [],
    });
    setResults(0);
  };

  const addDigit = (val: string) => {
    let { digits, curr } = state;
    let str: string;
    digits[curr] !== undefined && digits[curr] !== ""
      ? (str = digits[curr].slice(-1))
      : (str = "");
    if (digits.length === 0 || digits[curr] === undefined) {
      digits.push(val);
    } else if (
      str === "0" &&
      (digits[curr].slice(-2, -1) === "" ||
        isNaN(Number(digits[curr].slice(-2, -1))))
    ) {
      digits[curr] = digits[curr].slice(0, -1) + val;
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
    let { digits, ops, curr, count, startLevelIndex } = state;
    if (digits[curr] === "" || digits[curr] === undefined) {
      ops[curr - 1] = val;
    } else {
      ops[curr] = val;
      curr++;
      if (val2) {
        digits[curr] = val2;
        if (val2 === "(") {
          count++;
          startLevelIndex.push(curr);
        }
      }
    }
    setState((prev) => ({
      ...prev,
      ops,
      curr,
      count,
      startLevelIndex,
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
      : //do noting;
        setState((prev) => ({
          ...prev,
          digits: digits,
        }));
  };

  const addSpcial: Function = (val: string) => {
    let { digits, curr, count, startLevelIndex, percentLevel, endLevelIndex } =
      state;
    let str: string;
    digits[curr] !== undefined ? (str = digits[curr].slice(-1)) : (str = "");
    if (val === "()") {
      if (digits[curr] === "" || digits[curr] === undefined) {
        digits[curr] = "(";
        startLevelIndex.push(curr);
        count++;
      } else if (count > 0 && str !== "(") {
        digits[curr] += ")";
        endLevelIndex.push(curr);
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
        startLevelIndex.push(curr);
        count++;
      }
    } else if (val === "%") {
      if (digits[curr] === "" || digits[curr] === undefined)
        console.log("invaild format");
      else if (
        digits[curr].indexOf("%") === -1 &&
        (!isNaN(Number(digits[curr].slice(-1))) ||
          digits[curr].slice(-1) === ")")
      ) {
        digits[curr] += "%";
        percentLevel.push(
          startLevelIndex[startLevelIndex.length - endLevelIndex.length - 1]
        );
      }
    }

    setState((prev) => ({
      ...prev,
      digits,
      count,
      startLevelIndex,
      endLevelIndex,
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
    let { digits, ops, percentLevel, startLevelIndex } = state;
    let maintained = [...digits];
    for (let s = 0; s < maintained.length; s++) {
      let l = -1;
      for (let i = 0; i < maintained.length; i++) {
        if (maintained[i].indexOf("%") !== -1) {
          l++;
          if (
            ["+", "-"].indexOf(ops[i - 1]) + 1 &&
            ["+", "-", undefined].indexOf(ops[i]) + 1
          ) {
            if (
              maintained[i].indexOf("%") > maintained[i].indexOf(")") &&
              maintained[i].indexOf(")") >= 0
            ) {
              maintained[startLevelIndex[percentLevel[l] + 1]] =
                "(" + maintained[startLevelIndex[percentLevel[l] + 1]];
              maintained[i] =
                maintained[i].replace(
                  "%",
                  "/100*" +
                    doMath(
                      maintained.slice(
                        percentLevel[l],
                        startLevelIndex[
                          startLevelIndex.indexOf(percentLevel[l]) + 1
                        ]
                      ),
                      ops.slice(
                        percentLevel[l],
                        startLevelIndex[
                          startLevelIndex.indexOf(percentLevel[l])
                        ]
                      ),
                      getCount(
                        maintained.slice(
                          percentLevel[l],
                          startLevelIndex[
                            startLevelIndex.indexOf(percentLevel[l]) + 1
                          ]
                        )
                      )
                    )
                ) + ")";
            } else {
              maintained[i] =
                "(" +
                maintained[i].replace(
                  "%",
                  "/100*" +
                    doMath(
                      maintained.slice(percentLevel[l], i),
                      ops.slice(percentLevel[l], i - 1),
                      getCount(maintained.slice(percentLevel[l - 1], i))
                    )
                ) +
                ")";
            }
          } else {
            if (
              maintained[i].indexOf("%") > maintained[i].indexOf(")") &&
              maintained[i].indexOf(")") >= 0
            ) {
              maintained[i] = maintained[i].replace("%", "/100");
            } else {
              maintained[i] = "(" + maintained[i].replace("%", "/100") + ")";
            }
            console.log(maintained[i]);
          }
          break;
        }
      }
    }

    return maintained;
  }

  function getCount(arr: string[]) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].indexOf("(") !== -1) count++;
      if (arr[i].indexOf(")") !== -1) count--;
    }
    return count;
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
    while (count > 0) {
      total[total.length - 1] += ")";
      count--;
    }
    if (total.join("") === "") return 1;
    try {
      return Number(Function(`return ${total.join("")}`)());
    } catch (error) {
      return undefined;
    }
  }
  function strip(number: number) {
    return parseFloat(number.toPrecision(12));
  }
  function equal(val = "") {
    let results: number | undefined;
    const maintained = maintainPercent();
    results = doMath(maintained, state.ops);
    if (total.showed.join("") !== "" && results !== undefined) {
      setResults(results);
    } else {
      setResults(0);
    }
    if (results === undefined && val === "=") {
      invaildFormat();
      return;
    }

    if (
      document.getElementById("result")!.classList.contains("opacity-25") &&
      val === "="
    )
      document.getElementById("result")!.classList.remove("opacity-25");
    else if (
      !document.getElementById("result")!.classList.contains("opacity-25") &&
      val !== "="
    ) {
      document.getElementById("result")!.classList.add("opacity-25");
    }
    if (
      total.showed.join("") !== results?.toString() &&
      results !== undefined &&
      val === "="
    ) {
      dispatch(
        add({
          statePayload: JSON.parse(JSON.stringify({ ...state })),
          showedPayload: total.showed.join(""),
          resultsPayload: Number(strip(results)),
        })
      );
      setState({
        digits: [results.toString()],
        ops: [""],
        curr: 0,
        count: 0,
        startLevelIndex: [0],
        endLevelIndex: [],
        percentLevel: [],
      });
    }
  }
  useEffect(() => {
    if (results !== undefined) {
      document.getElementById("result")!.innerHTML = strip(results).toString();
    }
  }, [results]);
  useEffect(() => {
    let total: string[] = [];
    for (let i = 0; i < state.digits.length; i++) {
      total.push(state.digits[i]);
      if (state.ops[i] !== undefined) {
        total.push(state.ops[i]);
      }
    }
    if (total.join("") !== "") {
      equal();
    } else {
      setResults(0);
    }
    setTotal((prev) => ({
      ...prev,
      showed: total,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    if (total.showed.join("") === "")
      document.getElementById("input")!.innerHTML = "0";
    else document.getElementById("input")!.innerHTML = total.showed.join("");
  }, [total]);

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
        className="overflow-hidden duration-200 left-2 mt-2 shadow-2xl fixed sm:w-96 w-3/4 z-40"
      >
        <Screen click={maintainClick} />
        <Buttons ids={IDs} click={maintainClick} />
        <History post={loadHist} />
      </div>
    </div>
  );
}
type screenProps = {
  click: (id: string) => void;
};
const Screen = (props: screenProps) => {
  const { click } = props;
  return (
    <div className="align-center w-full bg-sky-600 p-10 rounded-tl rounded-tr">
      <Notify />
      <p
        id="input"
        className="duration-200 p-3 h-14 break-words overflow-y-auto"
      >
        0
      </p>
      <h2
        id="result"
        className="duration-200 text-2xl p-3 overflow-x-auto w-full"
      >
        {}0
      </h2>
      <div className="flex justify-between">
        <button
          id="toggleHist"
          onClick={() => {
            click("history");
          }}
          className="duration-200 text-white p-2 hover:text-gray-300 active:text-gray-500"
        >
          <VscHistory />
        </button>
        <button
          onClick={() => {
            click("backspace");
          }}
          className="duration-200 text-white p-2 hover:text-gray-300 active:text-gray-500"
        >
          <BsFillReplyFill />
        </button>
      </div>
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

type histProps = {
  post: (val: state, val2: number) => void;
};

const History = (props: histProps) => {
  const dispatch = useDispatch();
  const hist = useSelector(selectHist);
  const { histList, showed, results } = hist;

  const { post } = props;
  return (
    <div
      id="hist"
      className="duration-200 p-2 bg-white absolute left-0 -bottom-[200px] h-[12.5rem] w-full shadow-xl"
    >
      <div className="text-left h-3/4 overflow-y-auto m-1">
        {histList.map((histo, i) => (
          <div
            key={i}
            onClick={() => post(histo, results[i])}
            className="duration-200 cursor-pointer p-3 rounded hover:bg-gray-300"
          >
            <div className="w-full leading-10">
              <p>{showed[i]}</p>
            </div>
            <div className="w-full text-sky-600 leading-10">
              <p>= {results[i] ?? 0}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => dispatch(clear())}
        className="p-1 w-20 text-white rounded-lg duration-200 bg-sky-600 hover:text-white active:bg-sky-600 active:text-white"
      >
        Clear
      </button>
    </div>
  );
};

const Buttons = (props: Props) => {
  const { ids, click } = props;
  const digitClass =
    "group w-1/4 h-10 text-sky-600 rounded-full duration-200 active:scale-[200%] ";
  const opClass =
    "group w-1/4 h-10 text-gray-600 rounded-lg duration-200 active:scale-[200%] ";
  const clearClass =
    "group w-1/4 h-10 text-red-600 rounded-lg duration-200 active:scale-[200%] ";

  return (
    <div
      id="buttons"
      className="bg-gray-100 flex-auto rounded-bl rounded-br pt-2"
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
          <span className="duration-200 group-active:scale-150">{id}</span>
        </button>
      ))}
    </div>
  );
};
