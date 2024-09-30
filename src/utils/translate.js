"use server"

import Translate from "translate-json-object"

const TranslateJSON = async (source, lang) => {
    let TJO = Translate()
    TJO.init({
        googleApiKey: process.env.G_TRANSLATE,

    });
    // An example scenario (json) object


    return new Promise((res, rej) => {
        // Translate method takes (source object, and language code)
        TJO.translate(source, lang)
            .then(function (data) {
                console.log(data);
                res(data)
            }).catch(function (err) {
                console.log('error ', err)
                rej(err)
            });
    })
}

export default TranslateJSON