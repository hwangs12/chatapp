export function loginPassed(payload: string) {
    const userInfo: string[] = [];
    payload.split('&').map((str) => {
        userInfo.push(str.split('=')[1]);
    })
    return userInfo[1] === '123123'
}