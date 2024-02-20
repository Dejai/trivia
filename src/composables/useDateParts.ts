export function useDateParts(){

    let today = new Date()
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec" ]
    const monthIdx = today.getMonth()
    const currMonth = months[monthIdx] ?? 0
    const year = today.getFullYear()
    let maxDays = new Date(year, monthIdx, 0).getDate();
    let days = [...Array(maxDays+1).keys()]?.filter( x => x != 0)
    const currDay = today.getDate()

    return { months, currMonth, year, days, currDay }
}