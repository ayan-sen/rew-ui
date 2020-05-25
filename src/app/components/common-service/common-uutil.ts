export function convertToDate(dt : string) : Date {
    let d : Date = null;
    if(dt!= null && dt.length > 0) {
      d =  new Date(dt);
    }
    return d;
  }