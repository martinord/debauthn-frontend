const buff = require('./helpers').buff

/**
 * https://www.w3.org/TR/webauthn/#assertion-options
 */
export class PublicKeyCredentialRequestOptions {
    /**
     * Creates an object from an base64 buffers encoded object
     * @param {*} o object with challenge  and allowCredentials id element as base64 buffers
     */
    static decode(o){
        var obj = {}

        // required
        obj.challenge = buff.decode(o.challenge)
        
        // optional
        if(o.timeout)
            obj.timeout = o.timeout

        if(o.allowCredentials)
            obj.allowCredentials = [    // TODO: only supports one credential
                {
                    type: "public-key",
                    id: buff.decode(o.allowCredentials[0].id) 
                }
            ]
        
        if(o.userVerification)
            obj.userVerification = o.userVerification

        if(o.rp)
            obj.rp = { id: buff.decode(o.rp.id) }
        
        // if(o.extensions)
        //     obj.extensions = o.extensions

        return obj;
    }
    
    /**
     * Encodes the buffers in the object to base64
     * @param {} o PublicKeyCredentialRequestOptions
     */
    static encode(o){
       var obj = {}

        // required
        obj.challenge = buff.encode(o.challenge)
        
        // optional
        if(o.timeout)
            obj.timeout = o.timeout

        if(o.allowCredentials)
            obj.allowCredentials = [    // TODO: only supports one credential
                {
                    type: "public-key",
                    id: buff.encode(o.allowCredentials[0].id) 
                }
            ]
        
        if(o.userVerification)
            obj.userVerification = o.userVerification

        if(o.rp)
            obj.rp = { id: buff.encode(o.rp.id) }
        
        // if(o.extensions)
        //     obj.extensions = o.extensions
        
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