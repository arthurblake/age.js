/*

 The MIT License
 
 Copyright (c) 2010 Arthur Blake
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 -------
 
 age.js, convert an "age" into a human readable format.

 examples:

 // age.getAge takes two dates and tells you the age between those dates 
 
 age.getAge(new Date(1942,11,27), new Date(1970,9,18)) -> 27 years, 9 months, and 3 weeks
 age.getAge(new Date(1970,9,18), new Date(2010,09,03)) -> 39 years, 11 months, 2 weeks, and 1 day
 age.getAge(new Date(1987,6,12), new Date(1995,12,05)) -> 8 years, 5 months, 3 weeks, and 3 days

 // age.getDuration tells you the age of a millisecond time value
 
 age.getDuration(1000)           -> 1 second
 age.getDuration(60000)          -> 1 minute
 age.getDuration(31415926538979) -> 995 years, 6 months, 1 week, 5 days, 7 hours, 15 minutes, and 39 seconds

 // default accuracy is in seconds, but an optional additional parameter can be used to adjust the accuracy:
 // This is a numeric value which can be one of:
 // 1 Years
 // 2 Months
 // 3 Weeks
 // 4 Days
 // 5 Hours
 // 6 Minutes
 // 7 Seconds
    
 age.getAge(new Date(1942,11,27), new Date(1970,9,18), 1) -> 27 years
 age.getDuration(31415926538979, 2) -> 995 years, and 6 months
 
*/

// namespace
var age = age || {};

/**
 * Get a "calendar" age. (age between 2 dates in human readable format)
 * 
 * @param bday start date
 * @param now end date
 * @param accuracy (optional) how accurate to report the age up to.
 *   This is a numeric value which can be one of:
 *   1 Years
 *   2 Months
 *   3 Weeks
 *   4 Days
 *   5 Hours
 *   6 Minutes
 *   7 Seconds
 *
 *  If no accuracy is specified, the default value is 7.
 *  NOTE:  No rounding is done!  It might be nice to add this in the future.
 *  
 *  This means that if accuracy is 1 (for years) but the age is 1 year and 364
 *  days, 1 year will be reported even though the age is really a lot closer
 *  to 2 years.
 */
age.getAge = (function()
{
  var showWeeks=true,
    // gregorian calendar days in month lookup table
    daysInMonth=[31,28,31,30,31,30,31,31,30,31,30,31];

  // gregorian calendar leap year computation
  function daysInFebruary(y)
  {
    return y%4?28:y%400?y%100?29:28:29;
  }

  function daysInLastMonth(now)
  {
    var month = now.getMonth(),year=now.getFullYear();
    // if Jan, wrap back to Dec of previous year
    if (month===0)
    {
      month=11;
      year--;
    }
    else
    {
      month--;
    }

    // if it's february, we have to determine if it's a leap year
    if (month===1)
    {
      return daysInFebruary(year);
    }
    else
    {
      return daysInMonth[month];
    }
  }

  function daysInPenultimateMonth(now)
  {
    var month = now.getMonth(),year=now.getFullYear();

    // back up 2 months
    if (month===0)
    {
      month=10;
      year--;
    }
    else if (month===1)
    {
      month=11;
      year--;
    }
    else
    {
      month-=2;
    }

    // if it's february, we have to determine if it's a leap year
    if (month===1)
    {
      return daysInFebruary(year);
    }
    else
    {
      return daysInMonth[month];
    }
  }

  /** THIS COMMENT IS A COPY OF THE ONE ABOVE
   * Get a "calendar" age. (age between 2 dates in human readable format)
   * 
   * @param bday start date
   * @param now end date
   * @param accuracy (optional) how accurate to report the age up to.
   *   This is a numeric value which can be one of:
   *   1 Years
   *   2 Months
   *   3 Weeks
   *   4 Days
   *   5 Hours
   *   6 Minutes
   *   7 Seconds
   *
   *  If no accuracy is specified, the default value is 7.
   *  NOTE:  No rounding is done!  It might be nice to add this in the future.
   *  
   *  This means that if accuracy is 1 (for years) but the age is 1 year and 364
   *  days, 1 year will be reported even though the age is really a lot closer
   *  to 2 years.
   */
  function getCalendarAge(bday, now, accuracy)
  {
    var arr = [],
      years = now.getFullYear() - bday.getFullYear(),
      months = now.getMonth() - bday.getMonth(),
      days = now.getDate() - bday.getDate(),
  
      hours = now.getHours() - bday.getHours(),
      minutes = now.getMinutes() - bday.getMinutes(),
      seconds = now.getSeconds() - bday.getSeconds(),
      weeks=0;

    function fmt(vector, singular, num, acc)
    {
      if (num === 0 || acc > accuracy)
      {
      }
      else if (num === 1)
      {
        vector.push(String(num) + ' ' + singular);
      }
      else
      {
        vector.push(String(num) + ' ' + singular + "s");
      }
    }
    
    if (!accuracy)
    {
      accuracy = 7;
    }
    
    // rollover adjustments
    if (seconds < 0)
    {
      seconds+=60;
      minutes--;
    }
    if (minutes < 0)
    {
      minutes+=60;
      hours--;
    }
    if (hours < 0)
    {
      hours+=24;
      days--;
    }
    if (days < 0)
    {
      days += daysInLastMonth(now);
      months--;

      if (days < 0)
      {
        days += daysInPenultimateMonth(now);
        months--;
      }
    }
    if (months < 0)
    {
      months+=12;
      years--;
    }
    if (showWeeks)
    {
      // compute weeks...
      weeks = Math.floor(days/7);
      days = days % 7;
    }

    fmt(arr,'year',  years, 1);
    fmt(arr,'month', months, 2);
    fmt(arr,'week',  weeks, 3);
    fmt(arr,'day',   days, 4);
    fmt(arr,'hour',  hours, 5);
    fmt(arr,'minute',minutes, 6);
    fmt(arr,'second',seconds, 7);

    if (arr.length > 1)
    {
      arr[arr.length-1] = 'and '+ arr[arr.length-1];
    }

    return arr.join(', ');
  }

  return getCalendarAge;

}) ();

/**
 * Format a millisecond time value as a human readable display time.
 */
age.getDuration = function(msec, accuracy)
{
  var end = new Date(),
    start = new Date(end.getTime()-msec);
  return age.getAge(start,end, accuracy);
};
