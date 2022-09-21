const htmlDatetime = document.querySelector("#datetime")
const htmlDate = document.querySelector("#date")
const htmlTime = document.querySelector("#time")

const months = [ 'jan.',
    'fev.',
    'mar.',
    'abr.',
    'mai.',
    'jun.',
    'jul.',
    'ago.',
    'set.',
    'out.',
    'nov.',
    'dez.',
]

function numberFormat(n) {
    return String(n).padStart(2, '0');
}

function setDate() {
    let datetime = new Date()

    let hours = numberFormat(datetime.getHours())
    let minutes = numberFormat(datetime.getMinutes())
    let seconds = numberFormat(datetime.getSeconds())

    htmlTime.innerHTML = `${hours}:${minutes}:${seconds}`
    htmlDate.innerHTML = `${datetime.getDate()} ${months[ datetime.getMonth() ]}, ${datetime.getFullYear()}`
}

setDate()
setInterval(() => {
    setDate()
}, 100)
