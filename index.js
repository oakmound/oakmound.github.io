if (!WebAssembly.instantiateStreaming) { // polyfill
    WebAssembly.instantiateStreaming = async (resp, importObject) => {
        const source = await (await resp).arrayBuffer();
        return await WebAssembly.instantiate(source, importObject);
    };
}
let mod, inst;
const go = new Go();

async function load(scriptName) {
    document.getElementById("runButton").setAttribute("hidden", "");
    WebAssembly.instantiateStreaming(fetch(scriptName), go.importObject).then((result) => {
        mod = result.module;
        inst = result.instance;
        document.getElementById("runButton").removeAttribute("hidden");
        document.getElementById("loadButton").disabled = true;
    }).catch((err) => {
        console.error(err);
        document.getElementById("errorText").innerHTML = err
        document.getElementById("errorText").removeAttribute("hidden") 
        setTimeout(() => {
            document.getElementById("errorText").setAttribute("hidden", "") 
        }, 3000);
    });
}

async function run() {
    console.clear();
    await go.run(inst);
    inst = await WebAssembly.instantiate(mod, go.importObject); // reset instance
}