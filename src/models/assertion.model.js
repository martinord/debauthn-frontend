const buff = require('./helpers').buff

export class PublicKeyCredentialRequestOptions {
    /**
     * Creates an object from an base64 buffers encoded object
     * @param {*} o object with challenge and user.id as base64 buffers
     */
    static decode(o){
        var obj = {}
        obj.challenge = buff.decode(o.challenge)
        obj.timeout = o.timeout
        obj.allowCredentials = [    // TODO: only supports one credential
            {
                type: "public-key",
                id: buff.decode(o.allowCredentials[0].id) 
            }
        ]
        return obj;
    }
    
    /**
     * Encodes the buffers in the object to base64
     * @param {} o PublicKeyCredentialCreationOptions
     */
    static encode(o){
        var obj = {}
        obj.challenge = buff.encode(o.challenge)
        obj.timeout = o.timeout
        obj.allowCredentials = o.allowCredentials
        return obj;
    }
}


export class AuthenticatorAssertionResponse {
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
            authenticatorData: o.response.authenticatorData,
            clientDataJSON: o.response.clientDataJSON,
            signature: o.response.signature,
            userHandle: o.response.userHandle
        };
        return obj;
    }

    /**
     * Encodes the buffers in the object to base64
     * @param {} o AuthenticatorAssertionResponse
     */
    static encode(o){
        var obj = {};
        obj.id = o.id;
        obj.rawId = Buffer.from(o.rawId);
        obj.response = {
            authenticatorData: buff.encode(o.response.authenticatorData),
            clientDataJSON: buff.encode(o.response.clientDataJSON),
            signature: buff.encode(o.response.signature),
            userHandle: o.response.userHandle ? buff.encode(o.response.userHandle) : o.response.userHandle
        };
        return obj;
    }
}