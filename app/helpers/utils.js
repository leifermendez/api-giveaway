const {Observable} = require('rxjs')
const axios = require('axios')

const httpRequest$ = (url, method, headers = {}, data = null) => new Observable((observer) => {
    const request = {
        method,
        url,
        headers
    }
    if (data) {
        request.data = data
    }
    axios(request)
        .then((response) => {
            observer.next(response.data)
            observer.complete()
        })
        .catch((error) => {
            observer.error(error)
        })
})

module.exports = {httpRequest$}
