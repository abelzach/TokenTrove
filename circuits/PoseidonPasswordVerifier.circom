pragma circom 2.0.0;

// Include Poseidon circuit
include "poseidon.circom";

template PoseidonPasswordVerifier() {
    // Input: Plaintext password as private input
    signal input password;

    // Input: Provided hash of the password as public input
    signal input passwordHash;

    // Intermediate signal for computed hash
    signal computedHash;

    // Instantiate Poseidon with fixed nInputs
    component hash = Poseidon(1);

    // Connect the input
    hash.inputs[0] <== password;

    // Get the computed hash
    computedHash <== hash.out;

    // Constraint: Ensure computed hash matches the provided hash
    passwordHash === computedHash;
}

component main = PoseidonPasswordVerifier();
