/*
 * cryptography.js
 * This file contains functions and wrappers for
 */

const KEY_SIZE = 2048; // Key size in bits
const DEFAULT_PASSWORD = "chat"; // Default password for RSA keys

/**
 * Stores a public/private RSA keypair
 */
class KeyPair {
    constructor() {
        this.key = cryptico.generateRSAKey(DEFAULT_PASSWORD, KEY_SIZE);
        this.public = cryptico.publicKeyString(this.key);
        this.id = SHA256(this.public);
    }

    /**
     * Sign {plaintext} for {peer}, returns empty string if error
     * @param plaintext
     * @param peer
     * @returns {string}
     */
    sign(plaintext) {
        let result = cryptico.encrypt(plaintext, this.key);

        if (result.status !== "success") {
            return result.cipher;
        } else {
            return "";
        }
    }
}
