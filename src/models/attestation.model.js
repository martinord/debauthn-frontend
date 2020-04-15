const buff = require('./helpers').buff

export class PublicKeyCredentialCreationOptions {
    /**
     * Creates an object from an base64 buffers encoded object
     * @param {*} o object with challenge and user.id as base64 buffers
     */
    static decode(o){
        var obj = {}
        obj.attestation = o.attestation;
        obj.rp = o.rp;
        obj.user = o.user;
        obj.pubKeyCredParams = o.pubKeyCredParams;
        obj.challenge = buff.decode(o.challenge);
        obj.user.id = buff.decode(o.user.id);
        return obj;
    }
    
    /**
     * Encodes the buffers in the object to base64
     * @param {} o PublicKeyCredentialCreationOptions
     */
    static encode(o){
        var obj = {}
        obj.attestation = o.attestation;
        obj.rp = o.rp;
        obj.user = o.user;
        obj.pubKeyCredParams = o.pubKeyCredParams;
        obj.challenge = buff.encode(o.challenge);
        obj.user.id = buff.encode(o.user.id);
        return obj;
    }
}


export class AuthenticatorAttestationResponse {
    /**
     * Creates an object from an base64 buffers encoded object
     * @param {*} o object with response.attestationObject and response.clientDataJSON e
     *              encoded as base64 buffers
     */
    static decode(o){
        var obj = {};
        obj.id = o.id;
        obj.rawId = Buffer.from(o.rawId).buffer;
        obj.response = {
            attestationObject: o.response.attestationObject,
            clientDataJSON: o.response.clientDataJSON
        };
        return obj;
    }

    /**
     * Encodes the buffers in the object to base64
     * @param {} o AuthenticatorAttestationResponse
     */
    static encode(o){
        var obj = {};
        obj.id = o.id;
        obj.rawId = Buffer.from(o.rawId);
        obj.response = {
            attestationObject: buff.encode(o.response.attestationObject),
            clientDataJSON: buff.encode(o.response.clientDataJSON)
        };
        return obj;
    }
}