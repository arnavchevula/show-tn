export class DateParser {
    private hasDecemberPassed = false;
    private currentYear: number;

    constructor() {
        this.currentYear = new Date().getFullYear();
    }

    parseRawDate(date: string): Date {
        const tempDate = new Date(date);
        // Create date in local timezone to avoid UTC conversion issues
        const eventDate = new Date(
            this.currentYear,
            tempDate.getMonth(),
            tempDate.getDate(),
            0, 0, 0, 0
        );

        if (eventDate.getMonth() === 11) {
            this.hasDecemberPassed = true;
        }

        if (this.hasDecemberPassed && eventDate.getMonth() === 0) {
            // we have passed December, increment year for January events
            this.currentYear++;
            eventDate.setFullYear(this.currentYear);
            this.hasDecemberPassed = false;
        }

        return eventDate;
    }
}