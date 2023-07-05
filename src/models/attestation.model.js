const buff = require('./helpers').buff

/**
 * https://www.w3.org/TR/webauthn/#dictionary-makecredentialoptions
 */
export class PublicKeyCredentialCreationOptions {
    /**
     * Creates an object from an base64url buffers encoded object
     * @param {*} o object with challenge and user.id as base64url buffers
     */
    static decode(o){
        var obj = {}

        // required
        obj.rp = o.rp;
        obj.user = o.user;
        obj.user.id = buff.decode(o.user.id);
        obj.challenge = buff.decode(o.challenge);
        obj.pubKeyCredParams = o.pubKeyCredParams;
        
        // optional
        if(o.attestation)
            obj.attestation = o.attestation;
        if(o.timeout)
            obj.timeout = o.timeout
        if(o.excludeCredentials){
            obj.excludeCredentials = []
            o.excludeCredentials.forEach(function(credential){
                obj.excludeCredentials.push({
                    type: "public-key",
                    id: buff.decode(credential.credentialID) 
                })
            })
        }
        if(o.authenticatorSelection)
            obj.authenticatorSelection = o.authenticatorSelection
        // if(o.extensions)
        //     obj.extensions = o.extensions
        return obj;
    }
    
    /**
     * Encodes the buffers in the object to base64url
     * @param {} o PublicKeyCredentialCreationOptions
     */
    static encode(o){
        var obj = {}

        // required
        obj.rp = o.rp;
        obj.user = o.user;
        obj.user.id = buff.encode(o.user.id);
        obj.challenge = buff.encode(o.challenge);
        obj.pubKeyCredParams = o.pubKeyCredParams;
        
        // optional
        if(o.attestation)
            obj.attestation = o.attestation;
        if(o.timeout)
            obj.timeout = o.timeout
        if(o.excludeCredentials){
            obj.excludeCredentials = []
            o.excludeCredentials.forEach(function(credential){
                obj.excludeCredentials.push({
                    type: "public-key",
                    id: buff.encode(credential.id) 
                })
            })
        }
        if(o.authenticatorSelection)
            obj.authenticatorSelection = o.authenticatorSelection
        // if(o.extensions)
        //     obj.extensions = o.extensions
        return obj;
    }
}


export class AuthenticatorAttestationResponse {
    /**
     * Creates an object from an base64url buffers encoded object
     * @param {*} o object with response.attestationObject and response.clientDataJSON e
     *              encoded as base64url buffers
     */
    static decode(o){
        var obj = {};
        obj.id = o.id;
        obj.rawId = buff.decode(o.rawId);
        obj.response = {
            attestationObject: o.response.attestationObject,
            clientDataJSON: o.response.clientDataJSON
        };
        return obj;
    }

    /**
     * Encodes the buffers in the object to base64url
     * @param {} o AuthenticatorAttestationResponse
     */
    static encode(o){
        var obj = {};
        obj.id = o.id;
        obj.rawId = buff.encode(o.rawId);
        obj.response = {
            attestationObject: buff.encode(o.response.attestationObject),
            clientDataJSON: buff.encode(o.response.clientDataJSON)
        };
        return obj;
    }
}