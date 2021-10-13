const {of} = require('rxjs');
const {map, mergeMap, tap, catchError} = require('rxjs/operators');
const {httpError} = require('../helpers/handleError')
const commentModel = require('../models/comments')
const {httpRequest$} = require('../helpers/utils')


const filterData = (data = [], name) => {
    return data.map(({snippet}) => {
        const {videoId, topLevelComment} = snippet;
        const dataRawBefore = {
            comment: topLevelComment.snippet.textOriginal,
            author: topLevelComment.snippet.authorDisplayName,
            authorChannelUrl: topLevelComment.snippet.authorChannelUrl,
            video: videoId
        };
        return (dataRawBefore.author === name) ? dataRawBefore : null;
    })
}

const startCall = (video = '') => {
    try {
        const hash = process.env.HASH || null
        let dataTmp = []
        const url = [
            `https://youtube.googleapis.com/youtube/v3/commentThreads?`,
            `part=snippet&searchTerms=${encodeURIComponent(hash)}&videoId=${video}`,
            `&maxResults=100`,
            `&alt=json&prettyPrint=true`,
            `&key=${process.env.API_GOOGLE}`
        ].join('')

        const childCall$ = (token) => httpRequest$(`${url}&pageToken=${token}`, 'get')
            .pipe(
                tap(() => console.log('**** Llamando siguiente pagina HIJO ****')),
                map((list) => {
                    const {items} = list
                    dataTmp = dataTmp.concat(items)
                    return list
                })
            )

        const mainCall$ = httpRequest$(url, 'get')

        return mainCall$
            .pipe(
                map((list) => {
                    const {items} = list
                    console.log('***************** COMENZAMOS PRIMER LLAMADO ***************')
                    dataTmp = dataTmp.concat(items)
                    return list
                }),
                mergeMap((a) => { //TODO: Debido a que Youtube limita las peticiones y resultados colocare esto!
                    const {nextPageToken} = a
                    return nextPageToken ? childCall$(nextPageToken) : of(a)
                }),
                mergeMap((a) => { //TODO: Si existe? Obtenemos los siguientes 100
                    const {nextPageToken} = a
                    return nextPageToken ? childCall$(nextPageToken) : of(a)
                }),
                mergeMap((a) => { //TODO: Si existe? Obtenemos los siguientes 100
                    const {nextPageToken} = a
                    return nextPageToken ? childCall$(nextPageToken) : of(a)
                }),
                mergeMap((a) => { //TODO:Si existe? Obtenemos los siguientes 100
                    const {nextPageToken} = a
                    return nextPageToken ? childCall$(nextPageToken) : of(a)
                }),
                mergeMap((a) => { //TODO:Si existe? Obtenemos los siguientes 100
                    const {nextPageToken} = a
                    return nextPageToken ? childCall$(nextPageToken) : of(a)
                }),
                mergeMap((a) => { //TODO:Si existe? Obtenemos los siguientes 100
                    const {nextPageToken} = a
                    return nextPageToken ? childCall$(nextPageToken) : of(a)
                }),
                map(() => {
                    return {data: dataTmp}
                }),
                catchError(val => of(`${val}`))
            )

    } catch (e) {
        console.log('ERROR', e)
        return of([])
    }
}

//TODO: Ir guardando en base de datos para evitar peticiones a Youtube

const saveComments = async ({video1 = [], video2 = []}) => {
    const mergeComments = [].concat(video1).concat(video2);
    const query = mergeComments.map(a => {
        const {comment, video, authorChannelUrl} = a;
        return {
            'updateOne': {
                'filter': {comment, video, authorChannelUrl},
                'update': {'$set': a},
                'upsert': true
            }
        }
    })
    await commentModel.bulkWrite(query)

}

const getItems = async (req, res) => {
    const displayName = req.user.name || null

    const callVideo1$ = await startCall(process.env.VIDEO_ONE, displayName)
        .pipe(
            map(({data}) => {
                return filterData(data, displayName)
            }),
            map(b => b.filter(c => (c)))
        )
        .toPromise()

    const callVideo2$ = await startCall(process.env.VIDEO_TWO, displayName)
        .pipe(
            map(({data}) => {
                return filterData(data, displayName)
            }),
            map(b => b.filter(c => (c)))
        )
        .toPromise()

    const resultFinal = {
        video1: callVideo1$,
        video2: callVideo2$
    }
    res.send({data: resultFinal})

    await saveComments(resultFinal)
}


module.exports = {getItems}
