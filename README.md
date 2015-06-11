# age.js
A very simple library for displaying time intervals (ages) in human readable English

Examples:

```js
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
```
