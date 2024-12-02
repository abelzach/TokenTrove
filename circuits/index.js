const { buildPoseidon } = require("circomlibjs");

(async () => {
    const poseidon = await buildPoseidon();
    const password = "123456";
    const passwordFieldElement = BigInt(password.split("").map(c => c.charCodeAt(0)).join(""));
    console.log(passwordFieldElement);
    const hash = poseidon.F.toString(poseidon([passwordFieldElement]));
    console.log(hash);
})();

