import React, { useState } from "react";

export default function Calc() {
  const [state, setState] = useState({
    menu: false,
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
      <div className="w-96 left-2 mt-2 shadow-2xl fixed sm:w-96 w-4/5">
        <Screen />
        <Buttons ids={IDs} click={maintainClick} />
      </div>
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit perspiciatis dolorem iusto voluptatem! Impedit ad hic molestiae voluptas, nobis beatae magni nulla corporis? Nostrum tempora ducimus rem laudantium quas iusto est perspiciatis sint quisquam amet fuga beatae provident, fugit at deserunt nulla itaque eos voluptatem dolore recusandae, nam cumque eaque illum! Voluptate sequi quam repudiandae perspiciatis in quas! Sunt amet accusamus quasi quod voluptatum at eveniet placeat praesentium saepe voluptatibus molestias rem illo, dolor optio necessitatibus ea? Magnam eligendi praesentium error obcaecati repellendus cupiditate soluta et vel hic voluptatum. Qui cumque corrupti, expedita modi distinctio, vitae nesciunt perspiciatis, delectus veniam vero atque numquam recusandae dolores ullam eligendi officia labore dolorum sit optio. Voluptatibus, exercitationem veniam aperiam molestias tenetur inventore vero asperiores sapiente officia. Illo ipsum quod beatae qui consequuntur accusamus odio, assumenda neque magni labore porro officia exercitationem aliquid eum tempora alias quasi nisi, reiciendis minima repellat! Quidem, ullam perferendis necessitatibus odit voluptatum architecto, ipsum fuga id at expedita soluta in exercitationem molestiae nostrum est inventore maiores officiis distinctio libero suscipit neque, error maxime. Optio, magnam reprehenderit possimus ullam aliquam perferendis ipsa quibusdam tempora natus culpa sint soluta voluptates dicta sed ratione suscipit placeat cumque pariatur aliquid architecto ad voluptatem distinctio ipsam! Dolorem iste quae ut minus est, corporis beatae doloribus officiis optio perferendis ipsa dignissimos voluptatem ullam aut odio magni temporibus. Laboriosam assumenda consequuntur alias porro sunt. Similique eos, dolores eum itaque ipsa blanditiis provident nisi laborum fugit. Natus maiores in id sequi. Soluta iste porro ipsam architecto neque placeat facilis rerum quam. Placeat eligendi nulla vitae cumque provident accusamus laboriosam optio dolores repellendus eos totam, iste expedita exercitationem mollitia quisquam iure dolore repellat dolor ducimus dignissimos vel, tempora magni natus! Placeat pariatur nemo laudantium quaerat quis id porro voluptatibus! Beatae voluptatibus assumenda consequatur! Ea nihil ullam modi hic harum commodi exercitationem et accusantium iure cum deserunt dolor quis voluptatem, optio fuga obcaecati. Deserunt, reiciendis id magnam ratione doloremque dolorum voluptates quasi doloribus aliquam dolores nam asperiores, possimus nemo accusamus autem temporibus nesciunt odio eveniet quidem recusandae praesentium beatae. Facilis quisquam iure deserunt velit. Veritatis dolorum ducimus qui voluptatibus distinctio, dicta error natus est quo minus amet. Harum reiciendis excepturi totam amet, odio incidunt quibusdam? Perspiciatis deserunt dicta quasi laborum porro, architecto assumenda laboriosam officiis aliquid omnis nihil sed asperiores reprehenderit incidunt recusandae, optio voluptas dignissimos quibusdam, consequuntur enim eos repellat aliquam nesciunt. Labore temporibus error accusamus, eos molestiae adipisci, distinctio molestias in ipsum dolorem maxime odit ducimus ea corporis. Molestiae quo ex excepturi mollitia nisi consequuntur nemo soluta pariatur tempore autem quibusdam odit repellat tempora, corporis doloribus doloremque nostrum dicta vitae fugiat! Aliquid voluptate libero ab tempore qui incidunt consectetur esse delectus sunt vitae. Ea, dicta, quidem voluptatibus ipsum libero eos facere incidunt quibusdam, inventore voluptatem molestiae voluptas. Explicabo earum nisi incidunt iusto culpa quo porro, minima deserunt! Adipisci fugiat quod excepturi ipsa dolor odit minus assumenda ratione laborum itaque architecto repellat nobis dolores eligendi illum possimus, facilis quos obcaecati accusamus. Fugit earum nisi laborum veniam at quisquam error quos accusamus, eaque aut expedita, obcaecati voluptates sed inventore. Quibusdam vel iste odio, dolore nostrum perspiciatis ipsam omnis labore. Iusto, adipisci corrupti id ullam autem maiores doloremque eius distinctio commodi culpa aut saepe non soluta perspiciatis, at similique quaerat velit. Eum ducimus, consequatur ipsum veniam repudiandae eaque nostrum quod error non ipsam incidunt, consequuntur eveniet officiis sequi similique laborum, asperiores commodi explicabo officia facere animi dicta dolores. Voluptates, sed esse! Iure accusamus delectus magni architecto mollitia recusandae pariatur doloremque, similique veritatis aliquam ea ut saepe commodi ab alias a autem perspiciatis incidunt deleniti facere explicabo! Repellendus velit veniam aspernatur deleniti. Incidunt maxime esse quae sequi at a placeat ex minus ducimus, dolorum sapiente accusantium in eius et cumque hic, maiores doloremque alias molestiae repellendus ipsa dicta? Eum ullam aperiam soluta accusamus qui perferendis numquam rem suscipit error, ad eligendi esse mollitia ipsa rerum reprehenderit neque voluptates impedit sequi! Quis tempora ullam quam, architecto corporis facere nobis, cumque velit quasi exercitationem sit, eveniet officiis officia deserunt atque amet! Nesciunt magnam dolore fugiat delectus earum, iure provident laudantium voluptatibus. Consectetur molestiae vel, corporis ab maxime similique iusto esse inventore nesciunt cum mollitia? Voluptatum excepturi qui enim earum odio quam delectus tempore quia magni cupiditate! Deserunt, fugit. Dignissimos hic obcaecati perferendis voluptatem cupiditate soluta maxime molestias, accusamus delectus excepturi perspiciatis reiciendis, ipsa, eum ab adipisci exercitationem voluptatum deserunt aspernatur sequi doloremque consequatur expedita. Ex magni qui modi tempore ea consequuntur recusandae, nobis fugiat, incidunt nesciunt quos minus explicabo placeat soluta suscipit! Eius aut impedit illo aliquid numquam omnis a dolorum illum at fuga commodi, reprehenderit laborum, rerum quibusdam ad provident molestias natus sed aperiam nulla. Ea nam mollitia rem vitae fuga quibusdam sint molestias debitis culpa, consequuntur ratione cum iure enim fugit animi eveniet? Odit amet excepturi vitae dolorum dignissimos sequi omnis dolore ea delectus rerum, voluptas officia in ipsa fugiat nemo tenetur rem commodi neque totam repellendus, nisi quibusdam expedita? Voluptatem expedita, voluptates odio nihil possimus a quod suscipit distinctio voluptatum fugit temporibus. Dolore cum accusamus facere dolorem ea nisi cumque sed, vitae officia nihil ab similique, animi officiis modi sit? Magnam ut esse dolore, cupiditate accusantium quia laboriosam excepturi ratione deserunt quae quis voluptate fugiat iste expedita nulla animi magni libero eligendi neque itaque. Numquam, animi voluptates sunt suscipit odio hic laboriosam praesentium, alias, quo perspiciatis quisquam ducimus! Quasi, dicta consectetur! Qui maiores cum ipsa rem eaque quibusdam quis ratione nostrum? Aliquid eaque recusandae quidem. Quaerat expedita tempora quod dolore quam exercitationem animi enim sed adipisci totam ab earum obcaecati assumenda rem blanditiis debitis nemo, illum provident recusandae architecto. Repudiandae vel adipisci accusamus iure, facere saepe quibusdam provident quidem corrupti. Voluptatem corporis consequuntur ut eligendi molestias ex, inventore deleniti perspiciatis saepe asperiores blanditiis accusamus autem alias qui ullam, repellendus voluptate excepturi hic quaerat pariatur sequi. Optio officia culpa nostrum fuga aliquam laborum mollitia aut inventore deserunt unde amet eius labore quia, harum officiis architecto totam cupiditate exercitationem sequi voluptatum. Obcaecati iusto minima perspiciatis consequuntur! Exercitationem magnam adipisci ipsa eaque quas?
      </div>
    </div>
  );
}

const Screen = () => {
  return (
    <div className="w-full bg-sky-600 p-10 rounded-tl rounded-tr">
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
    "w-1/4 sm:h-10 h-auto text-sky-600 rounded-full duration-200 hover:bg-sky-600 hover:text-white";
  const opClass =
    "w-1/4 sm:h-10 h-auto text-gray-600 rounded-lg duration-200 hover:bg-sky-600 active:bg-gray-400";
  const clearClass =
    "w-1/4 sm:h-10 h-auto text-red-600 rounded-lg duration-200 hover:bg-sky-600 active:bg-gray-400";

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
