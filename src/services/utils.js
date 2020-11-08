export const catchError = res => {
    if (res.code >= 400) {
        console.log(res)
        throw new Error(res)
    }
    else {
        return res.json()
    }
}