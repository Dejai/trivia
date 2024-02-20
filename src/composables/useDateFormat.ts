
export function useDateFormat(dateObj:Date, format:string){
    // Base values
    var currDate = new Date();
    var year = currDate.getFullYear()?.toString();
    var monthNum = currDate.getMonth()+1;
    var month = (monthNum < 10) ? "0"+monthNum : ""+monthNum;
    var dayNum = currDate.getDate();
    var day = (dayNum < 10) ? "0"+dayNum : ""+dayNum;
    var hour = currDate.getHours()?.toString();
    var minute = currDate.getMinutes()?.toString();
    var seconds = currDate.getSeconds()?.toString();

    // The date parts formatted
    var formattedDate = format;
    formattedDate = formattedDate.replace("yyyy", year);
    formattedDate = formattedDate.replace("MM", month);
    formattedDate = formattedDate.replace("dd", day);
    formattedDate = formattedDate.replace("hh", hour);
    formattedDate = formattedDate.replace("mm", minute);
    formattedDate = formattedDate.replace("ss", seconds);

    return formattedDate;
}
