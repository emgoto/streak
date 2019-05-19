const util = require('../js/util.js');
const moment = require('../js/moment-timezone-with-data-2012-2022.js');
   
let today;     // saturday 15th Dec 2018
let yesterday; // friday 14th Dec 2018

beforeAll(() => {
    today = moment('2018-12-15', 'YYYY-MM-DD');
    yesterday = moment('2018-12-14', 'YYYY-MM-DD');
    Date.now = jest.fn(() => new Date('December 15, 2018 00:00:00').valueOf());
});

describe('calendarDatesThisWeek', () => {
    test('There should be 5 dates from Monday to today (not including today) in a MM/DD/YYYY format', () => {
        const expectedValue = ['12/10/2018', '12/11/2018', '12/12/2018', '12/13/2018', '12/14/2018'];
        expect(util.calendarDatesThisWeek("MONDAY", yesterday)).toEqual(expectedValue);
    });

    test('There should be 6 dates from Sunday to today (not including today) in a MM/DD/YYYY format', () => {
        const expectedValue = ['12/09/2018', '12/10/2018', '12/11/2018', '12/12/2018', '12/13/2018', '12/14/2018'];
        expect(util.calendarDatesThisWeek("SUNDAY", yesterday)).toEqual(expectedValue);
    });
});

describe('getDatesInRange', () => {
    test('There should be 3 dates in a MM/DD/YYYY format', () => {
        const expectedValue = ['12/10/2018', '12/11/2018', '12/12/2018'];
        expect(util.getDatesInRange(moment('2018-12-10'), moment('2018-12-12'))).toEqual(expectedValue);
    });
});

describe('calendarDatesInWeek', () => {
    test('There should be 7 dates', () => {
        const expectedValue = ['12/10/2018', '12/11/2018', '12/12/2018', '12/13/2018', '12/14/2018', '12/15/2018', '12/16/2018'];
        expect(util.calendarDatesInWeek("MONDAY", today)).toEqual(expectedValue);
    });

    test('There should be 7 dates', () => {
        const expectedValue = ['12/09/2018', '12/10/2018', '12/11/2018', '12/12/2018', '12/13/2018', '12/14/2018', '12/15/2018'];
        expect(util.calendarDatesInWeek("SUNDAY", today)).toEqual(expectedValue);
    });
});

describe('getStreakForWeek', () => {
    test('should return 3 if it has met daysInWeek requirement', () => {
        expect(util.getStreakForWeek(yesterday, ['12/10/2018', '12/12/2018', '12/14/2018'], "MONDAY", 3)).toEqual(3);
    });

    // Given [M, T, Th], streak = 3 as [M, T, Th, S, Su] = 5
    test('should start counting streak on Monday, as can still hit streak for the week (on Saturday and Sunday)', () => {
        expect(util.getStreakForWeek(yesterday, ['12/10/2018', '12/11/2018', '12/13/2018'], "MONDAY", 5)).toEqual(3);
    });

    // Given [M, Th], streak = 1 as Th is start date
    test('should start counting streak on Thursday, as cannot hit streak for week if starting on Monday', () => {
        expect(util.getStreakForWeek(yesterday, ['12/10/2018', '12/13/2018'], "MONDAY", 5)).toEqual(1);
    });

    test('should return 0 if today is start of the week', () => {
        expect(util.getStreakForWeek(yesterday, ['12/09/2018', '12/08/2018'], "MONDAY", 5)).toEqual(0);
    });
    test('should return 1 if yesterday is start of the week', () => {
        yesterday = moment('2018-12-10', 'YYYY-MM-DD');
        expect(util.getStreakForWeek(yesterday, ['12/10/2018'], "MONDAY", 6)).toEqual(1);
    });
    test('should return 0 if yesterday is start of the week, and no dates this week', () => {
        expect(util.getStreakForWeek(yesterday, [], "MONDAY", 6)).toEqual(0);
    });
    test('should return 3 if many dates, but daysInWeek is only 1', () => {
        expect(util.getStreakForWeek(yesterday, ['12/10/2018', '12/11/2018', '12/12/2018'], "MONDAY", 1)).toEqual(3);
    });
    test('should return 2 if last 2 days in week are met', () => {
        yesterday = moment('2018-12-09', 'YYYY-MM-DD');
        expect(util.getStreakForWeek(yesterday, ['12/08/2018', '12/09/2018'], "MONDAY", 7)).toEqual(2);
    });
    test('get streak for full week, over two different months', () => {
        const endDay = moment('12/02/2018', 'MM/DD/YYYY')
        expect(util.getStreakForWeek(endDay, ['11/26/2018', '11/27/2018', '11/28/2018', '11/29/2018', '11/30/2018', '12/01/2018', '12/02/2018'], "MONDAY", 7)).toEqual(7);
    });
});


describe('getStreak', () => {
    test('if today only, should return streak of 1', () => {
        expect(util.getStreak(today, ['12/15/2018'], "MONDAY", 7)).toEqual(1);
    });   
    test('should return full week and last day from last week', () => {
        expect(util.getStreak(today, ['12/09/2018', '12/10/2018', '12/11/2018'], "MONDAY", 2)).toEqual(3);
    });   
    test('should return full week, last full week before that, and 1 day', () => {
        expect(util.getStreak(today, ['12/02/2018', '12/05/2018', '12/09/2018', '12/10/2018', '12/11/2018'], "MONDAY", 2)).toEqual(5);
    });
    test('15 days straight', () => { // until 15th (today)
        expect(util.getStreak(today, ['12/01/2018', '12/02/2018',
                                            '12/03/2018', '12/04/2018', '12/05/2018', '12/06/2018', '12/07/2018', '12/08/2018', '12/09/2018',
                                            '12/10/2018', '12/11/2018', '12/12/2018', '12/13/2018', '12/14/2018', '12/15/2018'],
                                            "MONDAY", 7)
        ).toEqual(15);
    });
    test('22 days straight', () => {
        expect(util.getStreak(today, ['11/24/2018', '11/25/2018', 
                                            '11/26/2018', '11/27/2018', '11/28/2018', '11/29/2018', '11/30/2018', '12/01/2018', '12/02/2018',
                                            '12/03/2018', '12/04/2018', '12/05/2018', '12/06/2018', '12/07/2018', '12/08/2018', '12/09/2018',
                                            '12/10/2018', '12/11/2018', '12/12/2018', '12/13/2018', '12/14/2018', '12/15/2018'], 
                                            "MONDAY", 7)
        ).toEqual(22);
    });
    test('random', () => {
        expect(util.getStreak(moment('2019-03-28', 'YYYY-MM-DD'), ["12/07/2018", "12/08/2018", "12/09/2018", "12/10/2018", "12/06/2018", "12/05/2018",
                                             "03/10/2019", "03/01/2019", "03/24/2019", "03/23/2019", "03/22/2019", "03/21/2019",
                                             "03/20/2019", "03/19/2019", "03/18/2019", "03/11/2019", "03/12/2019", "03/13/2019",
                                             "03/14/2019", "03/15/2019", "03/16/2019", "03/17/2019", "03/26/2019", "03/25/2019",
                                             "03/27/2019", "03/28/2019"], 
                                            "MONDAY", 7)
        ).toEqual(19);
    });
    test('3 day week', () => { // Thursday / Saturday last week, haven't hit this week. should still have a streak
        expect(util.getStreak(moment('2019-05-07', 'YYYY-MM-DD'), ["05/02/2019", "05/04/2019"], 
                                            "MONDAY", 3)
        ).toEqual(2);
    });
    test('3 day week', () => { // Thursday / Friday last week, hit Friday this week. Today is Friday. Should have a streak of 3.
    expect(util.getStreak(moment('2019-05-10', 'YYYY-MM-DD'), ["05/02/2019", "05/03/2019", "05/10/2019"], 
                                        "MONDAY", 3)
        ).toEqual(3);
    });
    test('5 day week', () => { // Thursday / Friday last week, hit Friday this week. Today is Friday. Should have a streak of 3.
        expect(util.getStreak(moment('2019-05-11', 'YYYY-MM-DD'), ["05/02/2019", "05/05/2019", "05/08/2019", "05/09/2019", "05/10/2019"], 
                                            "MONDAY", 5)
        ).toEqual(3);
    });
    test('7 day week', () => { // Random days, break in streak on 11th, 18th - 20th = streak of 3
        expect(util.getStreak(moment('2019-05-20', 'YYYY-MM-DD'), ["05/04/2019", "05/05/2019", "05/06/2019", "05/07/2019", "05/8/2019",
                                                                    "05/09/2019", "05/10/2019", "05/12/2019", "05/13/2019", "05/18/2019",
                                                                    "05/19/2019", "05/20/2019"], 
                                            "MONDAY", 7)
        ).toEqual(3);
    });
});   
