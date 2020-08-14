async function getData(url = ''){
    const response = await fetch(url, {
        method: 'GET',
        headers: {"X-Requested-With": "XMLHttpRequest"}
    });
    return await response.json();
}

async function postData(url = '', data){
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: data
    });
    return await response.json();
}

const createElement = (name, attributes, ...children) => {
    let node = document.createElement(name);
    for(const attr in attributes)
        if(attributes.hasOwnProperty(attr))
            node.setAttribute(attr, attributes[attr]);
    children.forEach(child => {
        if(typeof child !== 'string') node.appendChild(child);
        else node.appendChild(document.createTextNode(child));
    });
    return node;
}

const applyStyles = (css) => {
    const head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
    style.type = 'text/css';

    if(style.styleSheet) {
        // This is required for IE8 and below.
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
}

const formToObject = form => Array.from(new FormData(form)).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
}, {});

const formToQueryString = form => {
    let props = [];
    new FormData(form).forEach((value, key) => {
        props.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    });
    return props.join('&');
}

export {getData, postData, createElement, applyStyles, formToObject, formToQueryString}


/*public class DateTimeUtil
{

    public static long getNormalizedUtcDateForToday() {

    /!*
     * This number represents the number of milliseconds that have elapsed since January
     * 1st, 1970 at midnight in the GMT time zone.
     *!/
    long utcNowMillis = System.currentTimeMillis();

    /!*
     * This TimeZone represents the device's current time zone. It provides us with a means
     * of acquiring the offset for local time from a UTC time stamp.
     *!/
    TimeZone currentTimeZone = TimeZone.getDefault();

    /!*
     * The getOffset method returns the number of milliseconds to add to UTC time to get the
     * elapsed time since the epoch for our current time zone. We pass the current UTC time
     * into this method so it can determine changes to account for daylight savings time.
     *!/
    long gmtOffsetMillis = currentTimeZone.getOffset(utcNowMillis);

    /!*
     * UTC time is measured in milliseconds from January 1, 1970 at midnight from the GMT
     * time zone. Depending on your time zone, the time since January 1, 1970 at midnight (GMT)
     * will be greater or smaller. This variable represents the number of milliseconds since
     * January 1, 1970 (GMT) time.
     *!/
    long timeSinceEpochLocalTimeMillis = utcNowMillis + gmtOffsetMillis;

    /!* This method simply converts milliseconds to days, disregarding any fractional days *!/
    long daysSinceEpochLocal = TimeUnit.MILLISECONDS.toDays(timeSinceEpochLocalTimeMillis);

    /!*
     * Finally, we convert back to milliseconds. This time stamp represents today's date at
     * midnight in GMT time. We will need to account for local time zone offsets when
     * extracting this information from the database.
     *!/
    long normalizedUtcMidnightMillis = TimeUnit.DAYS.toMillis(daysSinceEpochLocal);

    return normalizedUtcMidnightMillis;
}

    /!**
     * Helper method to convert the database representation of the date into something to display
     * to users. As classy and polished a user experience as "1474061664" is, we can do better.
     * <p/>
     * The day string for forecast uses the following logic:
     * For today: "Today, June 8"
     * For tomorrow:  "Tomorrow
     * For the next 5 days: "Wednesday" (just the day name)
     * For all days after that: "Mon, Jun 8" (Mon, 8 Jun in UK, for example)
     *
     * @param context               Context to use for resource localization
     * @param datetime
     * @param showFullDate          Used to show a fuller-version of the date, which always
     *                              contains either the day of the week, today, or tomorrow, in
     *                              addition to the date.
     *
     * @return A user-friendly representation of the date such as "Today, June 8", "Tomorrow",
     * or "Friday"
     *!/
    public static String getFriendlyDateString(Context context, long datetime, boolean showFullDate)
{
    long normalizedUtcMidnight = normalizeDate(datetime);
    long normalizedUtcMidnightToday = getNormalizedUtcDateForToday();
    long daysFromEpochToToday = elapsedDaysSinceEpoch(normalizedUtcMidnightToday);
    long daysFromEpochToProvidedDate = elapsedDaysSinceEpoch(normalizedUtcMidnight);

    if (showFullDate) {
        String dayName = getDayName(context, normalizedUtcMidnight);
        String readableDate = getReadableDateString(context, datetime);
        if (daysFromEpochToProvidedDate - daysFromEpochToToday < 2) {
            /!*
             * Since there is no localized format that returns "Today" or "Tomorrow" in the API
             * levels we have to support, we take the name of the day (from SimpleDateFormat)
             * and use it to replace the date from DateUtils. This isn't guaranteed to work,
             * but our testing so far has been conclusively positive.
             *
             * For information on a simpler API to use (on API > 18), please check out the
             * documentation on DateFormat#getBestDateTimePattern(Locale, String)
             * https://developer.android.com/reference/android/text/format/DateFormat.html#getBestDateTimePattern
             *!/
            String localizedDayName = new SimpleDateFormat("EEEE").format(normalizedUtcMidnight);
            return readableDate.replace(localizedDayName, dayName);
        } else {
            return readableDate;
        }
    } else if (daysFromEpochToProvidedDate == daysFromEpochToToday || daysFromEpochToProvidedDate == daysFromEpochToToday - 1) {
    String dayName = getDayName(context, normalizedUtcMidnight);
    String readableTime = getReadableTimeString(context, datetime);

    return String.format("%s, %s", dayName, readableTime);
} else {
    return getReadableDateString(context, datetime);
}
}


/!**
 * This method returns the number of days since the epoch (January 01, 1970, 12:00 Midnight UTC)
 * in UTC time from the current date.
 *
 * @param utcDate A date in milliseconds in UTC time.
 *
 * @return The number of days from the epoch to the date argument.
 *!/
private static long elapsedDaysSinceEpoch(long utcDate)
{
    return TimeUnit.MILLISECONDS.toDays(utcDate);
}

/!**
 * @param date The date (in milliseconds) to normalize
 * @return  date with 00:00 time
 *!/
public static long normalizeDate(long date)
{
    return elapsedDaysSinceEpoch(date) * DAY_IN_MILLIS;
}


public static boolean isDateNormalized(long millisSinceEpoch) {
    return millisSinceEpoch % DAY_IN_MILLIS == 0;
}


/!**
 * Returns a date string in the format specified, which shows an abbreviated date without a
 * year.
 *
 * @param context      Used by DateUtils to format the date in the current locale
 * @param timeInMillis Time in milliseconds since the epoch (local time)
 *
 * @return The formatted date string
 *!/
private static String getReadableDateString(Context context, long timeInMillis)
{
    int flags = DateUtils.FORMAT_SHOW_TIME | DateUtils.FORMAT_SHOW_DATE | DateUtils.FORMAT_SHOW_WEEKDAY;

    return DateUtils.formatDateTime(context, timeInMillis, flags);
}

private static String getReadableTimeString(Context context, long timeInMillis)
{
    return DateUtils.formatDateTime(context, timeInMillis, DateUtils.FORMAT_SHOW_TIME);
}

private static String getDayName(Context context, long date)
{
    long daysFromEpochToProvidedDate = elapsedDaysSinceEpoch(date);
    long daysFromEpochToToday = elapsedDaysSinceEpoch(getNormalizedUtcDateForToday());

    int daysAfterToday = (int) (daysFromEpochToProvidedDate - daysFromEpochToToday);

    switch (daysAfterToday) {
        case -1:
            return context.getString(R.string.yesterday);
        case 0:
            return context.getString(R.string.today);
        case 1:
            return context.getString(R.string.tomorrow);
        default:
            SimpleDateFormat dayFormat = new SimpleDateFormat("EEEE");
            return dayFormat.format(date);
    }
}
}*/
