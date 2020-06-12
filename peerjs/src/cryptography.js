/*
 * cryptography.js
 * This file contains functions and wrappers for
 */

const KEY_SIZE = 2048; // Key size in bits
const DEFAULT_PASSWORD = "chat"; // Default password for RSA keys
const PUBKEY_HASH_ALGO = "SHA-256"; // Default key hashing algorithm

class KeyPair {
    constructor() {
        this.key = cryptico.generateRSAKey(DEFAULT_PASSWORD, KEY_SIZE);
        this.public = cryptico.publicKeyString(this.key);
        this.id = this._id();
    }

    /**
     * Get hash (PUBKEY_HASH_ALGO) of public key.
     * @private
     */
    _id () {
        // Encode the public key as UTF-8
        const msgBuffer = new TextEncoder().encode(this.public);

        // hash the message
        const hashBuffer = crypto.subtle.digest(PUBKEY_HASH_ALGO, msgBuffer);

        // convert ArrayBuffer to Array
        const hashArray = Array.from(new Uint8Array(hashBuffer));

        // convert bytes to hex string
        return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    }
}
