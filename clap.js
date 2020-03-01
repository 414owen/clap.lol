(() => {
  const split = delim => str => str.split(delim);

  const join = str => arr => arr.join(str);

  const trim = str => str.trim();

  const map = fn => arr => arr.map(fn);

  const pipe = (fn1, ...fns) => (...args) =>
    fns.reduce((acc, fn) => fn(acc), fn1(...args));

  const through = (data, ...fns) => pipe(...fns)(data);

  const mapLines = (fn, txt) =>
    through(
      txt,
      split("\n"),
      map(fn),
      join("\n")
    );

  const clapLine = symbol =>
    pipe(
      trim,
      split(/\s+/g),
      join(` ${symbol} `)
    );

  const clap = (symbol, txt) => mapLines(clapLine(symbol), txt);

  const display = document.getElementById("clap-display");

  const copyToClipboard = str => {
    const el = document.createElement("textarea");
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  const input = document.getElementById("input");

  try {
    input.value = location.hash.length < 2 ? "hello world" : atob(location.hash.slice(1));
  } catch (e) {}

  let clapSymbol = "👏";

  const currentClap = () => clap(clapSymbol, input.value);

  const updateClap = () => {
    display.innerText = currentClap();
    location.hash = btoa(input.value);
  };

  const debounce = (time, fn) => {
    let last = null;
    return (...args) => {
      if (last != null) clearTimeout(last);
      last = setTimeout(() => {
        fn(...args);
        last = null;
      }, time);
    };
  };

  const debouncedUpdateClap = debounce(500, updateClap);

  const loader = document.getElementById("loader");

  const nextLoaderState = (() => {
    let a = true;
    return () => {
      a = !a;
      return a ? "one" : "two";
    };
  })();

  input.addEventListener("keydown", () => {
    loader.classList.remove("one");
    loader.classList.remove("two");
    loader.classList.add(nextLoaderState());
  });

  input.addEventListener("keyup", debouncedUpdateClap);
  input.focus();

  const copy = document.getElementById("copy");

  updateClap();

  const notick = debounce(800, () => {
    copy.classList.remove("tick");
  });

  copy.addEventListener("click", () => {
    copy.classList.add("tick");
    copyToClipboard(currentClap());
    setTimeout(notick, 500);
  });

  [].slice.call(document.querySelectorAll("#choice > *")).forEach(el => {
    el.addEventListener("click", () => {
      document.querySelector("#choice > .selected").className = "";
      el.className = "selected";
      clapSymbol = el.innerText;
      updateClap();
    });
  });
})();
